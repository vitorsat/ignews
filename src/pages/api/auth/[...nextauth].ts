import NextAuth, { Account, Profile, User } from "next-auth"
import GithubProvider from "next-auth/providers/github"

import {fauna } from '../../../services/fauna'
import {query as q} from 'faunadb'

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    }),
  ],
  callbacks: {
    async signIn(params: {user: User, account: Account, profile: Profile & Record<string, unknown>;}) {
      const {email} = params.user
      
      try {
      await fauna.query(
        q.Create(
          q.Collection('users'),
          {data: {email}}
        )
      )
      return true
    } catch (err) {
      return false
    } 
    }
  }
})