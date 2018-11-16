// Helper function to generate a secret hash for a user thats signing up
export function generateHash() {
    let hash = [];
    for (let i = 0; i < 6; i++) {
        hash.push(Math.floor(Math.random() * 10));
    }
    return hash;
}
//# sourceMappingURL=secret-hash.js.map