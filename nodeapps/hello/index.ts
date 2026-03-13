const message: string = "Hello, TypeScript with Node.js!";
console.log(message);

// ตัวอย่างการใช้ Function แบบระบุ Type
function greet(name: string): void {
  console.log(`สวัสดีคุณ ${name}!`);
}

greet("Developer");