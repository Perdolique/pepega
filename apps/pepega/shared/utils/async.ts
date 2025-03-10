export async function withMinimumDelay<P>(promise: Promise<P>, delay = 500) : Promise<P> {
  const { resolve, promise: delayPromise } = Promise.withResolvers()

  setTimeout(() => {
    resolve(promise)
  }, delay)

  await Promise.allSettled([promise, delayPromise])

  return promise
}
