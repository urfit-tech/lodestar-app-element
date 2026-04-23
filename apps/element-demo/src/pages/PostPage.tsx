import { CraftPostCollection } from '../craft/CraftPostCollection'

const PostPage: React.FC = () => {
  return (
    <div className="container">
      <h3 className="mt-4">publishedAt</h3>
      <CraftPostCollection source={{ from: 'publishedAt', limit: 3 }} />
      <h3 className="mt-4">popular</h3>
      <CraftPostCollection source={{ from: 'popular', limit: 3 }} />
    </div>
  )
}

export default PostPage
