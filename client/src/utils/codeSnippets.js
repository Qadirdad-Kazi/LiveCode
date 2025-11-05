// Enhanced code snippets library
export const CODE_SNIPPETS = {
  html: [
    {
      id: 'html-button',
      name: 'Button',
      code: '<button class="btn">Click me</button>',
      category: 'UI Elements'
    },
    {
      id: 'html-card',
      name: 'Card',
      code: `<div class="card">
  <div class="card-header">Title</div>
  <div class="card-body">Content goes here</div>
</div>`,
      category: 'UI Elements'
    },
    {
      id: 'html-modal',
      name: 'Modal',
      code: `<div class="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <p>Modal content</p>
  </div>
</div>`,
      category: 'UI Elements'
    },
    {
      id: 'html-form',
      name: 'Form',
      code: `<form>
  <input type="text" placeholder="Name">
  <input type="email" placeholder="Email">
  <button type="submit">Submit</button>
</form>`,
      category: 'Forms'
    }
  ],
  css: [
    {
      id: 'css-flex-center',
      name: 'Flexbox Center',
      code: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
      category: 'Layout'
    },
    {
      id: 'css-grid',
      name: 'CSS Grid',
      code: `.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}`,
      category: 'Layout'
    },
    {
      id: 'css-animation',
      name: 'Fade In Animation',
      code: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: fadeIn 0.5s ease-in;
}`,
      category: 'Animations'
    },
    {
      id: 'css-hover',
      name: 'Hover Effect',
      code: `.button {
  transition: transform 0.3s;
}

.button:hover {
  transform: scale(1.1);
}`,
      category: 'Effects'
    }
  ],
  javascript: [
    {
      id: 'js-debounce',
      name: 'Debounce Function',
      code: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
      category: 'Utilities'
    },
    {
      id: 'js-fetch',
      name: 'Fetch API',
      code: `async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}`,
      category: 'API'
    },
    {
      id: 'js-event-listener',
      name: 'Event Listener',
      code: `document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.btn');
  button.addEventListener('click', () => {
    console.log('Button clicked!');
  });
});`,
      category: 'Events'
    },
    {
      id: 'js-localstorage',
      name: 'LocalStorage',
      code: `// Save
localStorage.setItem('key', 'value');

// Get
const value = localStorage.getItem('key');

// Remove
localStorage.removeItem('key');`,
      category: 'Storage'
    }
  ],
  java: [
    {
      id: 'java-main',
      name: 'Main Method',
      code: `public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}`,
      category: 'Basics'
    },
    {
      id: 'java-hello',
      name: 'Hello World',
      code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      category: 'Basics'
    },
    {
      id: 'java-variables',
      name: 'Variables',
      code: `int age = 25;
String name = "John";
double price = 99.99;
boolean isActive = true;`,
      category: 'Basics'
    },
    {
      id: 'java-array',
      name: 'Array',
      code: `int[] numbers = {1, 2, 3, 4, 5};
String[] names = new String[10];
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}`,
      category: 'Data Structures'
    },
    {
      id: 'java-list',
      name: 'ArrayList',
      code: `import java.util.ArrayList;

ArrayList<String> list = new ArrayList<>();
list.add("Item 1");
list.add("Item 2");
for (String item : list) {
    System.out.println(item);
}`,
      category: 'Data Structures'
    },
    {
      id: 'java-class',
      name: 'Class Definition',
      code: `public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}`,
      category: 'OOP'
    },
    {
      id: 'java-if',
      name: 'If-Else',
      code: `if (condition) {
    // Code block
} else if (anotherCondition) {
    // Code block
} else {
    // Code block
}`,
      category: 'Control Flow'
    },
    {
      id: 'java-for',
      name: 'For Loop',
      code: `for (int i = 0; i < 10; i++) {
    System.out.println(i);
}`,
      category: 'Control Flow'
    },
    {
      id: 'java-while',
      name: 'While Loop',
      code: `while (condition) {
    // Code block
    // Update condition
}`,
      category: 'Control Flow'
    },
    {
      id: 'java-switch',
      name: 'Switch Statement',
      code: `switch (value) {
    case 1:
        // Code
        break;
    case 2:
        // Code
        break;
    default:
        // Code
}`,
      category: 'Control Flow'
    }
  ],
  php: [
    {
      id: 'php-hello',
      name: 'Hello World',
      code: `<?php
echo "Hello, World!";
?>`,
      category: 'Basics'
    },
    {
      id: 'php-variables',
      name: 'Variables',
      code: `<?php
$name = "John";
$age = 25;
$price = 99.99;
$isActive = true;
?>`,
      category: 'Basics'
    },
    {
      id: 'php-array',
      name: 'Array',
      code: `<?php
$numbers = [1, 2, 3, 4, 5];
$names = array("John", "Jane", "Bob");

foreach ($numbers as $number) {
    echo $number . "\\n";
}
?>`,
      category: 'Data Structures'
    },
    {
      id: 'php-associative-array',
      name: 'Associative Array',
      code: `<?php
$person = [
    "name" => "John",
    "age" => 25,
    "city" => "New York"
];

echo $person["name"];
?>`,
      category: 'Data Structures'
    },
    {
      id: 'php-function',
      name: 'Function',
      code: `<?php
function greet($name) {
    return "Hello, " . $name . "!";
}

echo greet("John");
?>`,
      category: 'Functions'
    },
    {
      id: 'php-class',
      name: 'Class',
      code: `<?php
class Person {
    private $name;
    private $age;
    
    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
    }
    
    public function getName() {
        return $this->name;
    }
}
?>`,
      category: 'OOP'
    },
    {
      id: 'php-if',
      name: 'If-Else',
      code: `<?php
if ($condition) {
    // Code block
} elseif ($anotherCondition) {
    // Code block
} else {
    // Code block
}
?>`,
      category: 'Control Flow'
    },
    {
      id: 'php-for',
      name: 'For Loop',
      code: `<?php
for ($i = 0; $i < 10; $i++) {
    echo $i . "\\n";
}
?>`,
      category: 'Control Flow'
    },
    {
      id: 'php-foreach',
      name: 'Foreach Loop',
      code: `<?php
$items = ["apple", "banana", "orange"];

foreach ($items as $item) {
    echo $item . "\\n";
}
?>`,
      category: 'Control Flow'
    },
    {
      id: 'php-switch',
      name: 'Switch Statement',
      code: `<?php
switch ($value) {
    case 1:
        echo "One";
        break;
    case 2:
        echo "Two";
        break;
    default:
        echo "Other";
}
?>`,
      category: 'Control Flow'
    },
    {
      id: 'php-database',
      name: 'Database Connection',
      code: `<?php
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "database";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>`,
      category: 'Database'
    }
  ]
};

export function getSnippetsByCategory(language) {
  const snippets = CODE_SNIPPETS[language] || [];
  const categories = [...new Set(snippets.map(s => s.category))];
  return categories.map(category => ({
    category,
    snippets: snippets.filter(s => s.category === category)
  }));
}

export function searchSnippets(query, language) {
  const snippets = CODE_SNIPPETS[language] || [];
  const lowerQuery = query.toLowerCase();
  return snippets.filter(snippet =>
    snippet.name.toLowerCase().includes(lowerQuery) ||
    snippet.code.toLowerCase().includes(lowerQuery) ||
    snippet.category.toLowerCase().includes(lowerQuery)
  );
}

