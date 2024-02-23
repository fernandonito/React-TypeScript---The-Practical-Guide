import { ReactNode, useEffect, useState } from 'react'
import { z } from 'zod'
import { get } from './util/http'
import BlogPosts, { type BlogPost } from './components/BlogPosts'
import fetchingImg from './assets/data-fetching.png'
import ErrorMessage from './components/ErrorMessage'

// const rawDataBlogPostSchema = z.object({
//   id: z.number(),
//   userId: z.number(),
//   title: z.string(),
//   body: z.string(),
// });

// outside of App component function (since this doesn't need to be re-created all the time)
const rawDataBlogPostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
})
// z.array() is a Zod method that creates a new schema based on another schema
// as the name suggests, it's simply an array containing the expected objects
const expectedResponseDataSchema = z.array(rawDataBlogPostSchema)

function App() {
  const [fetchedPosts, setFetchedPosts] = useState<BlogPost[]>()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<string>()

  // useEffect(() => {
  //   async function fetchPosts() {
  //     setIsFetching(true)
  //     try {
  //       const data = await get<RawDataBlogPost[]>(
  //         'https://jsonplaceholder.typicode.com/posts'
  //       )

  //       const blogPosts: BlogPost[] = data.map((rawPost) => ({
  //         id: rawPost.id,
  //         title: rawPost.title,
  //         text: rawPost.body,
  //       }))

  //       setFetchedPosts(blogPosts)
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         setError(error.message)
  //       }
  //       // setError('Failed to fetch posts.')
  //     }

  //     setIsFetching(false)
  //   }

  //   fetchPosts()
  // }, [])

  useEffect(() => {
    async function fetchPosts() {
      setIsFetching(true)
      try {
        // const data = await get('https://jsonplaceholder.typicode.com/posts')
        const data = await get('https://jsonplaceholder.typicode.com/posts', z.array(rawDataBlogPostSchema));
        const parsedData = expectedResponseDataSchema.parse(data)
        // No more type casting via "as" needed!
        // Instead, here, TypeScript "knows" that parsedData will be an array
        // full with objects as defined by the above schema
        const blogPosts: BlogPost[] = parsedData.map((rawPost) => {
          return {
            id: rawPost.id,
            title: rawPost.title,
            text: rawPost.body,
          }
        })
        setFetchedPosts(blogPosts)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        }
        // setError('Failed to fetch posts!');
      }

      setIsFetching(false)
    }

    fetchPosts()
  }, [])

  let content: ReactNode

  if (error) {
    content = <ErrorMessage text={error} />
  }

  if (fetchedPosts) {
    content = <BlogPosts posts={fetchedPosts} />
  }

  if (isFetching) {
    content = <p id="loading-fallback">Fetching posts...</p>
  }

  return (
    <main>
      <img
        src={fetchingImg}
        alt="An abstract image depicting a data fetching process."
      />
      {content}
    </main>
  )
}

export default App
