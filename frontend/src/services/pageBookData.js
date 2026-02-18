import { fetchBookById, fetchBooksByQuery } from "./googleBooksApi";

export const MAIN_PAGE_CATEGORIES = [
    { key: "overall", title: "Trending", query: "bestseller" },
    { key: "fiction", title: "Fiction", query: "subject:fiction" },
    { key: "selfhelp", title: "Self-Help", query: "subject:self-help" },
    { key: "cs", title: "Computer-Science", query: "subject:computers" },
    { key: "thriller", title: "Thriller", query: "subject:thriller" },
];

export async function fetchMainPageBooks(options = {}) {
    const { maxResults = 12 } = options;
    const settled = await Promise.allSettled(
        MAIN_PAGE_CATEGORIES.map((cat) =>
            fetchBooksByQuery(cat.query, { maxResults })
        )
    );

    const booksByCategory = {};
    const errorsByCategory = {};

    settled.forEach((result, index) => {
        const key = MAIN_PAGE_CATEGORIES[index].key;

        if (result.status === "fulfilled") {
            booksByCategory[key] = result.value;
            errorsByCategory[key] = null;
            return;
        }

        booksByCategory[key] = [];
        errorsByCategory[key] = result.reason?.message ?? "Failed to fetch books";
    });

    return { booksByCategory, errorsByCategory };
}

export async function fetchAboutBookData(options = {}) {
    const { bookId, query = "bestseller" } = options;

    if (bookId) {
        return fetchBookById(bookId);
    }

    const books = await fetchBooksByQuery(query, { maxResults: 1 });
    return books[0] ?? null;
}
