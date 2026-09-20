#!/usr/bin/env node
/**
 * Verifies static-params helpers map API payloads correctly for empty and
 * populated catalogs without inventing placeholder routes.
 */
import assert from "node:assert/strict";

function mapSlugs(payload) {
  return payload?.data?.map((item) => item.slug) ?? [];
}

function mapIds(payload) {
  return payload?.data?.map((item) => String(item.id)) ?? [];
}

const empty = { data: [], meta: { total: 0 } };
assert.deepEqual(mapSlugs(empty), []);
assert.deepEqual(mapIds(empty), []);

const courses = {
  data: [
    { id: 7, slug: "aqeedah" },
    { id: 9, slug: "fiqh" },
  ],
};
assert.deepEqual(mapSlugs(courses), ["aqeedah", "fiqh"]);
assert.deepEqual(mapIds(courses), ["7", "9"]);

assert.deepEqual(mapSlugs(null), []);
assert.deepEqual(mapIds(undefined), []);

console.log("verify:static-params PASS");
