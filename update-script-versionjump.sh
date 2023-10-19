pnpm update --latest
pnpm i -D typescript@5.1

# Update test.ts to make it work -> copied file from angular-13-crud-example
sed -i 's|'zone.js/dist/long-stack-trace-zone'|'zone.js/testing'|' src/test.ts
sed -i -e '4,8d;14,20d;29,34d' src/test.ts
