import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface ContentData {
  id: string;
  body: string;
  [key: string]: any;
}

export function getSortedContentData(folder: string): ContentData[] {
  const fullPath = path.join(contentDirectory, folder);
  if (!fs.existsSync(fullPath)) return [];
  
  const fileNames = fs.readdirSync(fullPath);
  const allData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".md" from file name to get id
      const id = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullFilePath = path.join(fullPath, fileName);
      const fileContents = fs.readFileSync(fullFilePath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the id
      return {
        id,
        body: matterResult.content,
        ...(matterResult.data as Record<string, any>),
      };
    });

  // Sort by order
  return allData.sort((a, b) => {
    if ((a.order ?? 999) < (b.order ?? 999)) {
      return -1;
    } else if ((a.order ?? 999) > (b.order ?? 999)) {
      return 1;
    } else {
      return 0;
    }
  });
}
