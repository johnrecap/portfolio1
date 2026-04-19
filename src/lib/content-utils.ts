export const ALL_BLOG_CATEGORY = '__all__';

type ReadableMessage = {
  read?: boolean | null;
};

type CategorizedItem = {
  category?: string | null;
};

export function isUnreadMessage(message: ReadableMessage): boolean {
  return message.read !== true;
}

export function countUnreadMessages(messages: ReadableMessage[]): number {
  return messages.filter(isUnreadMessage).length;
}

export function buildBlogCategories(items: CategorizedItem[]): string[] {
  const categories = new Set<string>();

  items.forEach((item) => {
    const category = item.category?.trim();
    if (category) {
      categories.add(category);
    }
  });

  return [ALL_BLOG_CATEGORY, ...categories];
}

export function filterBlogsByCategory<T extends CategorizedItem>(
  items: T[],
  activeCategory: string,
): T[] {
  if (activeCategory === ALL_BLOG_CATEGORY) {
    return items;
  }

  return items.filter((item) => item.category === activeCategory);
}
