const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

function normalizeBook(item) {
    const info = item?.volumeInfo ?? {};

    return {
        id: item?.id ?? crypto.randomUUID(),
        name: info.title ?? "Untitled",
        image: info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || null,
        rating: info.averageRating ?? null,
        description: info.description ?? null,
        authors: info.authors ?? [],
        publishedDate: info.publishedDate ?? null,
    };
}

export async function fetchBooksByQuery(query, options = {}) {
    const {
        maxResults = 12,
        startIndex = 0,
    } = options;

    if (!query) {
        throw new Error("A search query is required.");
    }

    const params = new URLSearchParams({
        q: query,
        maxResults: String(maxResults),
        startIndex: String(startIndex),
    });

    const res = await fetch(`${GOOGLE_BOOKS_BASE_URL}?${params.toString()}`);

    if (!res.ok) {
        throw new Error(`Failed to fetch books (${res.status})`);
    }

    const data = await res.json();
    return (data.items ?? []).map(normalizeBook);
}

export async function fetchBooksByCategory(category, options = {}) {
    return fetchBooksByQuery(category, options);
}

export async function fetchBookById(volumeId) {
    if (!volumeId) {
        throw new Error("A volume id is required.");
    }

    const res = await fetch(`${GOOGLE_BOOKS_BASE_URL}/${encodeURIComponent(volumeId)}`);

    if (!res.ok) {
        throw new Error(`Failed to fetch book (${res.status})`);
    }

    const item = await res.json();
    return normalizeBook(item);
}
