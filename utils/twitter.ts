import { Emoji } from ".prisma/client"
import dotenv from "dotenv"
import Twitter, { RequestParameters } from "twitter-v2"

dotenv.config()

export interface PollOption {
  position: number
  label: string
  votes: number
}

type PollVotingStatus = "open" | "closed"

interface PollAttachment {
  id: string
  options: [PollOption]
  voting_status: PollVotingStatus
}

interface TweetWithPollAttachment {
  id: string
  text: string
  attachments: {
    poll_ids: [string]
  }
}

interface ResponseError {
  detail: string
  title: string
  resource_type: string
  parameter: string
  value: string
  type: string
}

interface CompetitionsResponse {
  data?: [TweetWithPollAttachment]
  errors?: [ResponseError]
  includes?: {
    polls: [PollAttachment]
  }
  meta?: {
    next_token?: string
  }
}

interface Competition {
  id: string
  options: PollOption[]
  status: PollVotingStatus
}

// Ignoring a warning here about using BigInt literals since this code only runs
// on the server
// @ts-ignore
const userId = 1066469679542071296n

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
})

export async function getCompetitions(
  paginationToken?: string
): Promise<Competition[]> {
  const options: RequestParameters = {
    expansions: "attachments.poll_ids",
    "poll.fields": "options,voting_status",
    max_results: "100",
  }

  if (paginationToken !== undefined) {
    options.pagination_token = paginationToken
  }

  return await client
    .get(`users/${userId}/tweets`, options)
    .then(async (response: CompetitionsResponse) => {
      if (
        response.data !== undefined &&
        response.includes !== undefined &&
        response.data.length >= 1
      ) {
        let additional: Competition[]

        if (response.meta?.next_token !== undefined) {
          await getCompetitions(response.meta.next_token)
            .then(
              (additionalCompetitions) => (additional = additionalCompetitions)
            )
            .catch((error) => console.error(error))
        }

        return response.includes.polls
          .map((poll) => {
            return {
              id: poll.id,
              options: poll.options.sort((a, b) => a.votes - b.votes),
              status: poll.voting_status,
            } as Competition
          })
          .concat(additional)
          .filter((item) => item !== undefined)
      }
    })
}

interface PostPollOptions {
  fighters: Emoji[]
}

export async function postPoll({
  fighters: [fighterA, fighterB],
}: PostPollOptions) {
  const body = {
    text: `Who would win in a fight? ${fighterA.utf} ${fighterA.shortname}, or ${fighterB.utf} ${fighterB.shortname}?`,
    poll: {
      options: [
        `${fighterA.utf} ${fighterA.shortname}`,
        `${fighterB.utf} ${fighterB.shortname}`,
      ],
      duration_minutes: 60 * 24,
    },
  }

  return await client.post("tweets", body)
}
