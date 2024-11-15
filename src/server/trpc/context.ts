import { type inferAsyncReturnType } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";

import { cloudinary } from "../cloudinary/cloudinary";
import { getServerAuthSession } from "../common/get-server-auth-session";
import { prisma } from "../db/client";
import { stripe } from "../stripe/client";

type CreateContextOptions = {
  session: Session | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
    cloudinary,
    stripe,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/

export const createContext = async (opts: Partial<CreateNextContextOptions> = {}) => {
  const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function

  const session = req && res ? await getServerAuthSession({ req, res }) : null;

  return {
    ...(await createContextInner({ session })),
    req,
    res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
