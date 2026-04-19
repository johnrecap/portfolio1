import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ALL_BLOG_CATEGORY,
  buildBlogCategories,
  countUnreadMessages,
  filterBlogsByCategory,
  isUnreadMessage,
} from './content-utils';

test('isUnreadMessage treats missing read state as unread', () => {
  assert.equal(isUnreadMessage({}), true);
  assert.equal(isUnreadMessage({ read: false }), true);
  assert.equal(isUnreadMessage({ read: true }), false);
});

test('countUnreadMessages counts only unread records', () => {
  assert.equal(
    countUnreadMessages([
      { read: false },
      { read: true },
      {},
    ]),
    2,
  );
});

test('buildBlogCategories keeps all sentinel first and preserves unique category order', () => {
  assert.deepEqual(
    buildBlogCategories([
      { category: 'Engineering' },
      { category: 'Product' },
      { category: 'Engineering' },
    ]),
    [ALL_BLOG_CATEGORY, 'Engineering', 'Product'],
  );
});

test('filterBlogsByCategory returns all posts for the all sentinel', () => {
  const posts = [
    { id: '1', category: 'Engineering' },
    { id: '2', category: 'Product' },
  ];

  assert.deepEqual(filterBlogsByCategory(posts, ALL_BLOG_CATEGORY), posts);
  assert.deepEqual(filterBlogsByCategory(posts, 'Product'), [{ id: '2', category: 'Product' }]);
});
