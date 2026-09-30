// Expose the human-readable `code` (e.g. CMP-1048) as `id` in API responses,
// so the UI keeps working with the same ids it used with mock data.
export function toJSONWithCode(schema) {
  schema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret) => {
      ret.id = ret.code
      delete ret._id
      delete ret.code
      return ret
    },
  })
}
