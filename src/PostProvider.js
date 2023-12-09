import { createContext, useContext, useState } from 'react';
import { faker } from '@faker-js/faker';

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// 1) Create a new Context
const PostContext = createContext();

// 2) Create a new Provider
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    console.log('Clear Posts');
    setPosts([]);
  }

  return (
    // 3) Provide value to child components
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

// 4) Create a hook to call the context directly
function usePosts() {
  const context = useContext(PostContext);
  // Create an error whenever someone tries to access the Context outside the Provider
  if (context === undefined)
    throw new Error('PostContext was used outside of the PostProvider');
  return context;
}

export { PostProvider, usePosts };
