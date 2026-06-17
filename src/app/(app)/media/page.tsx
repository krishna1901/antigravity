import { listMedia, getStorageUsage } from "@/lib/db/media";
import { listPosts } from "@/lib/db/posts";
import { MediaView } from "./_view";

export default async function MediaLibraryPage() {
  const [assets, posts, storage] = await Promise.all([
    listMedia(),
    listPosts(),
    getStorageUsage(),
  ]);
  return <MediaView assets={assets} posts={posts} storageLabel={storage.label} />;
}
