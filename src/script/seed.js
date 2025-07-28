



const jsQuestions = [
  {
    questionText: "Which of the following is the correct syntax to print in JavaScript?",
    options: ["print()", "console.log()", "echo()", "System.out.println()"],
    correctAnswer: "console.log()",
    explanation: "console.log() is used to print output to the browser console."
  },
  {
    questionText: "Which company developed JavaScript?",
    options: ["Microsoft", "Google", "Netscape", "Oracle"],
    correctAnswer: "Netscape",
    explanation: "JavaScript was created by Brendan Eich at Netscape."
  },
  {
    questionText: "How do you write a comment in JavaScript?",
    options: ["<!-- comment -->", "# comment", "// comment", "** comment **"],
    correctAnswer: "// comment",
    explanation: "JavaScript uses // for single-line comments."
  },
  {
    questionText: "How do you declare a variable in JavaScript?",
    options: ["int x = 5;", "let x = 5;", "x := 5;", "dim x = 5;"],
    correctAnswer: "let x = 5;",
    explanation: "let, const, and var are used to declare variables in JS."
  },
  {
    questionText: "What does `typeof NaN` return?",
    options: ["NaN", "number", "undefined", "object"],
    correctAnswer: "number",
    explanation: "Despite being 'Not a Number', typeof NaN returns 'number'."
  },
  {
    questionText: "What is the output of: '2' + 2?",
    options: ["22", "4", "NaN", "undefined"],
    correctAnswer: "22",
    explanation: "JavaScript converts number to string and concatenates."
  },
  {
    questionText: "Which keyword declares a constant in JavaScript?",
    options: ["let", "var", "const", "define"],
    correctAnswer: "const",
    explanation: "`const` declares a read-only variable."
  },
  {
    questionText: "What is the result of: typeof null?",
    options: ["null", "object", "undefined", "NaN"],
    correctAnswer: "object",
    explanation: "`typeof null` returns 'object' due to a legacy bug."
  },
  {
    questionText: "Which of the following is a JavaScript data type?",
    options: ["integer", "decimal", "boolean", "character"],
    correctAnswer: "boolean",
    explanation: "`boolean` is a valid JavaScript primitive data type."
  },
  {
    questionText: "What is used to convert a JSON string into an object?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.object()", "parse.JSON()"],
    correctAnswer: "JSON.parse()",
    explanation: "`JSON.parse()` parses a string and returns a JavaScript object."
  },
  {
    questionText: "What is the correct way to create a function in JavaScript?",
    options: ["function = myFunc()", "def myFunc()", "function myFunc()", "func myFunc()"],
    correctAnswer: "function myFunc()",
    explanation: "Functions in JavaScript are declared using the `function` keyword."
  },
  {
    questionText: "Which operator is used to assign a value?",
    options: ["=", "==", "===", ":"],
    correctAnswer: "=",
    explanation: "`=` is the assignment operator."
  },
  {
    questionText: "Which is not a valid JavaScript keyword?",
    options: ["var", "let", "const", "int"],
    correctAnswer: "int",
    explanation: "`int` is not a keyword in JavaScript."
  },
  {
    questionText: "What will `Boolean('0')` return?",
    options: ["true", "false", "0", "NaN"],
    correctAnswer: "true",
    explanation: "Non-empty strings are truthy in JavaScript."
  },
  {
    questionText: "How do you create an object in JavaScript?",
    options: ["var obj = {}", "var obj = []", "var obj = ()", "var obj = <>"],
    correctAnswer: "var obj = {}",
    explanation: "Objects are created using curly braces `{}`."
  },
  {
    questionText: "What does `isNaN('abc')` return?",
    options: ["true", "false", "NaN", "undefined"],
    correctAnswer: "true",
    explanation: "The string 'abc' is not a number, so it returns true."
  },
  {
    questionText: "Which built-in method adds one or more elements to the end of an array?",
    options: ["append()", "push()", "addToEnd()", "concat()"],
    correctAnswer: "push()",
    explanation: "`push()` adds elements to the end of an array."
  },
  {
    questionText: "How can you convert a string to a number in JavaScript?",
    options: ["parseInt()", "Number()", "Unary +", "All of the above"],
    correctAnswer: "All of the above",
    explanation: "All these methods can convert string to number."
  },
  {
    questionText: "Which of the following is not a loop structure in JavaScript?",
    options: ["for", "while", "loop", "do...while"],
    correctAnswer: "loop",
    explanation: "`loop` is not a valid loop structure."
  },
  {
    questionText: "What is the output of `typeof []`?",
    options: ["array", "object", "list", "undefined"],
    correctAnswer: "object",
    explanation: "Arrays in JavaScript are of type `object`."
  },
  {
    questionText: "What is the correct syntax for an arrow function?",
    options: ["function() => {}", "() => {}", "(=>) {}", "(function) =>"],
    correctAnswer: "() => {}",
    explanation: "Arrow functions use `() => {}` syntax."
  },
  {
    questionText: "What does `==='` do in JavaScript?",
    options: ["Assign value", "Compare values loosely", "Compare values and type", "None"],
    correctAnswer: "Compare values and type",
    explanation: "`===` checks both value and type."
  },
  {
    questionText: "What does `NaN` stand for?",
    options: ["Not a Name", "Not a Null", "Not a Number", "Negative and Null"],
    correctAnswer: "Not a Number",
    explanation: "`NaN` stands for 'Not a Number'."
  },
  {
    questionText: "What is the default value of `undefined`?",
    options: ["0", "null", "NaN", "undefined"],
    correctAnswer: "undefined",
    explanation: "`undefined` means a variable has been declared but not assigned."
  },
  {
    questionText: "Which operator is used for exponentiation in JavaScript?",
    options: ["^", "**", "exp", "^^"],
    correctAnswer: "**",
    explanation: "`**` is used for exponentiation in JavaScript."
  }
];







const mongoose = require("mongoose");

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quiz-wale";

// Quiz Schema
const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    default: "",
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    questions: [questionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags: [String],
    rating: {
     type :Number,
     default : 0,

    },
    imageUrl : { 
     type : String
    },
    maxAttempts: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

const Quiz = mongoose.model("Quiz", quizSchema);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

   

    // Insert Quizzes (add as many as you need)
 const quizzes = await Quiz.insertMany([
  {
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
    category: "Programming",
    duration: 1800,
    questions: jsQuestions,
    isActive: true,
    createdBy: new mongoose.Types.ObjectId("64ae7980c51e02a5e5c1e5c9"),
    difficulty: "medium",
    tags: ["javascript", "programming", "web development"],
    maxAttempts: 3,
    rating: 4,
    imageUrl: "https://res.cloudinary.com/dmfkglv8a/image/upload/v1753292329/quiz-images/peuup1cltfwvuvbyxnlq.png"
  },
]);


    console.log(`Created ${quizzes.length} quizzes`);
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit();
  }
}

seedDatabase();
