import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { eq } from "drizzle-orm";
import db from "../../database/db";
import { users, accounts, DbUser } from "../../database/schema";

export const configurePassport = () => {
  passport.use(
    new DiscordStrategy(
      {
        clientID: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        callbackURL: `${process.env.API_URL}/auth/discord/callback`,
        scope: ["identify", "email"],
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: any,
        done: any
      ) => {
        try {
          // 1. Check if we already have an account for this Discord user
          const existingAccount = await db.query.accounts.findFirst({
            where: eq(accounts.providerId, profile.id),
            with: {
              user: true,
            },
          });

          if (existingAccount) {
            return done(null, existingAccount.user);
          }

          // 2. If no account exists, create new user and account
          const [newUser] = await db
            .insert(users)
            .values({
              id: crypto.randomUUID(),
              email: profile.email,
              confirmed: true, // Auto-confirm OAuth users
            })
            .returning();

          // 3. Create the Discord account link
          await db.insert(accounts).values({
            id: crypto.randomUUID(),
            userId: newUser.id,
            provider: "discord",
            providerId: profile.id,
            providerEmail: profile.email,
            providerUsername: profile.username,
          });

          return done(null, newUser);
        } catch (err) {
          return done(err as Error, undefined);
        }
      }
    )
  );

  // Serialize user for the session
  passport.serializeUser((user, done) => {
    done(null, (user as DbUser).id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id),
      });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
