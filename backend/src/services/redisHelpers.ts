import { redis } from "../lib/redis.js";

export const getRecentTransactionsRedis =
  async (userId: string) => {
    const key = `user:${userId}:recent_txns`;

    const cached = await redis.lrange(key, 0, 29);

    return cached.map(txn =>
      JSON.parse(txn)
    );
  };