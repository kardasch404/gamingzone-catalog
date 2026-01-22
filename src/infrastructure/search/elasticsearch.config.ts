export const ELASTICSEARCH_CONFIG = {
  INDEX: 'products',
  SETTINGS: {
    analysis: {
      analyzer: {
        autocomplete: {
          tokenizer: 'autocomplete',
          filter: ['lowercase'],
        },
      },
      tokenizer: {
        autocomplete: {
          type: 'edge_ngram',
          min_gram: 2,
          max_gram: 10,
          token_chars: ['letter', 'digit'],
        },
      },
    },
  },
  MAPPINGS: {
    properties: {
      id: { type: 'keyword' },
      sku: { type: 'keyword' },
      name: {
        type: 'text',
        analyzer: 'standard',
        fields: {
          keyword: { type: 'keyword' },
          autocomplete: {
            type: 'text',
            analyzer: 'autocomplete',
          },
        },
      },
      description: { type: 'text' },
      category: {
        properties: {
          id: { type: 'keyword' },
          name: { type: 'keyword' },
        },
      },
      platform: { type: 'keyword' },
      basePrice: { type: 'float' },
      productType: { type: 'keyword' },
      condition: { type: 'keyword' },
      status: { type: 'keyword' },
      averageRating: { type: 'float' },
      tags: { type: 'keyword' },
      publishedAt: { type: 'date' },
    },
  },
};
