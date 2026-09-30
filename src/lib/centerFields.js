// Normalises the admin "waste center" form payload.
export function centerFields(body) {
  const types = Array.isArray(body.types) ? body.types : String(body.types || '').split(',')
  return {
    name: String(body.name || '').trim(),
    types: types.map((t) => String(t).trim()).filter(Boolean),
    address: String(body.address || '').trim(),
    phone: String(body.phone || '').trim(),
    hours: String(body.hours || '').trim(),
  }
}
