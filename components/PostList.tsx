import fs from "fs";
import path from "path";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  canonical: string;
}

export default async function PostList() {
  const postsDir = path.join(process.cwd(), "app", "n");
  const postNumbers = fs
    .readdirSync(postsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const posts: Post[] = [];

  for (const num of postNumbers) {
    const filePath = path.join(postsDir, num, "page.mdx");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      // Extract metadata
      const metadataMatch = content.match(
        /export const metadata = ({[^}]*});/s
      );
      if (metadataMatch) {
        const metadataStr = `{${metadataMatch[1]}}`;
        const metadata = new Function(`return ${metadataStr}`)();
        posts.push({
          slug: num,
          title: metadata.title,
          canonical: metadata.alternates.canonical,
        });
      }
    }
  }

  return (
    <div>
      <ul className="text-gray-800 dark:text-zinc-300 list-disc pl-5 space-y-1">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={post.canonical}
              className="text-blue-500 hover:text-blue-700 dark:text-gray-400 hover:dark:text-gray-300"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
