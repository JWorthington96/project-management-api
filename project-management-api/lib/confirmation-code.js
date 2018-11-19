// Helper function to generate a confirmation code for a user thats signing up
export function generateCode() {
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}
//# sourceMappingURL=confirmation-code.js.map