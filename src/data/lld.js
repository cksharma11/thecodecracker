export const lldTopics = [
  {
    id: 1,
    title: "Single Responsibility Principle (SRP)",
    category: "SOLID Principles",
    complexity: "Easy",
    summary: "A class should have one, and only one, reason to change. It defines cohesion and guides how to split logic into focused classes.",
    explanation: "The Single Responsibility Principle (SRP) asserts that a class should encapsulate only a single business function. If a class has multiple responsibilities, they become coupled. A change to one responsibility can inadvertently break or modify the behavior of another. SRP helps developers write highly cohesive, modular code that is easy to test and refactor.",
    umlStructure: `+-----------------------------------------+
|                  User                   |  <-- Core Data Model (Encapsulates user attributes)
+-----------------------------------------+
| - id: String                            |
| - email: String                         |
+-----------------------------------------+

+-----------------------------------------+
|           UserRepository                |  <-- Persistence Layer (Handles Database Operations)
+-----------------------------------------+
| + save(user: User): void                |
| + findById(id: String): User            |
+-----------------------------------------+

+-----------------------------------------+
|            UserEmailService             |  <-- Notification Layer (Handles Email Logic)
+-----------------------------------------+
| + sendWelcomeEmail(user: User): void    |
+-----------------------------------------+`,
    beforeCode: `// VIOLATION: This class handles user data, database persistence, AND notification emails.
// It has 3 different reasons to change (Data schema change, DB provider change, email format change).
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  // Reason to change 1: Database implementation details
  saveToDatabase() {
    console.log(\`Saving user \${this.name} to SQL Database...\`);
    // DB connection and insert query logic goes here...
  }

  // Reason to change 2: Email service SMTP settings or template adjustments
  sendWelcomeEmail() {
    console.log(\`Sending welcome email to \${this.email} using SMTP...\`);
    // SMTP connection and HTML email formatting goes here...
  }
}`,
    afterCode: `// COMPLIANT: Separation of concerns. Each class has a single responsibility.

// 1. Data Model (Holds User state)
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}

// 2. Persistence Controller (Handles DB transactions)
class UserRepository {
  save(user) {
    console.log(\`Saving user \${user.name} to Database...\`);
    // Abstraction of database operations
  }
}

// 3. Notification Service (Handles email SMTP connection)
class UserEmailService {
  sendWelcomeEmail(user) {
    console.log(\`Sending welcome email to \${user.email}...\`);
    // Abstraction of email sending logic
  }
}

// Client orchestration:
const user = new User("123", "Alice", "alice@example.com");
const repo = new UserRepository();
const emailService = new UserEmailService();

repo.save(user);
emailService.sendWelcomeEmail(user);`,
    tradeoffs: "High Cohesion vs Class Count: Applying SRP increases the total number of classes in the system, which can slightly increase mental tracking overhead initially. However, it significantly reduces testing complexity (classes can be mocked individually) and makes files shorter and easier to parse. Always balance SRP with logical grouping: do not separate closely coupled fields into different classes if they have no independent behaviors."
  },
  {
    id: 2,
    title: "Open-Closed Principle (OCP)",
    category: "SOLID Principles",
    complexity: "Medium",
    summary: "Software entities should be open for extension, but closed for modification. Extend behavior without rewriting working source code.",
    explanation: "The Open-Closed Principle (OCP) ensures that adding new features to a system does not require modifying existing code. Instead, we write the system in a way that allows us to add new behaviors by extending subclasses or implementing interfaces. This prevents regression bugs in previously tested code.",
    umlStructure: `            +--------------------------+
            |      PaymentMethod       |  <-- Interface (Closed for modification)
            +--------------------------+
            | + process(amount): void  |
            +--------------------------+
                         ^
         +---------------+---------------+
         |                               |
+-------------------+           +-------------------+
| CreditCardPayment |           |   PayPalPayment   |  <-- Concrete Extensions (Open for extension)
+-------------------+           +-------------------+
| + process(): void |           | + process(): void |
+-------------------+           +-------------------+`,
    beforeCode: `// VIOLATION: The PaymentProcessor has to be modified every time a new payment method is added.
// It relies on conditional checks that inspect specific classes.
class PaymentProcessor {
  processPayment(paymentType, amount) {
    if (paymentType === 'CREDIT_CARD') {
      console.log(\`Charging $\${amount} via Credit Card...\`);
      // Credit card charging logic
    } else if (paymentType === 'PAYPAL') {
      console.log(\`Charging $\${amount} via PayPal...\`);
      // PayPal integration logic
    } else {
      throw new Error("Payment method not supported");
    }
  }
}`,
    afterCode: `// COMPLIANT: Use polymorphism. PaymentProcessor is closed for modification,
// but open to extension by implementing new PaymentMethod classes.

// Interface equivalent in JavaScript (Contracts)
class PaymentMethod {
  process(amount) {
    throw new Error("process() must be implemented");
  }
}

// Extensions:
class CreditCardPayment extends PaymentMethod {
  process(amount) {
    console.log(\`Charging $\${amount} via Credit Card API...\`);
  }
}

class PayPalPayment extends PaymentMethod {
  process(amount) {
    console.log(\`Charging $\${amount} via PayPal OAuth...\`);
  }
}

// New extension (added without modifying PaymentProcessor):
class BitcoinPayment extends PaymentMethod {
  process(amount) {
    console.log(\`Charging $\${amount} via Lightning Network...\`);
  }
}

// Processor depends on abstraction:
class PaymentProcessor {
  processPayment(paymentMethod, amount) {
    paymentMethod.process(amount);
  }
}

// Usage:
const cc = new CreditCardPayment();
const btc = new BitcoinPayment();
const processor = new PaymentProcessor();

processor.processPayment(cc, 150.00);
processor.processPayment(btc, 0.0034);`,
    tradeoffs: "Polymorphism vs Simple Scripts: For small, simple scripts with only 2 payment methods that will never change, OCP can be over-engineering, introducing unnecessary abstraction layers. However, in core business engines (like checkout, report generation, or analytics), OCP is critical: it isolates developers from breaking peer changes by allowing them to work in isolated extension classes."
  },
  {
    id: 3,
    title: "Liskov Substitution Principle (LSP)",
    category: "SOLID Principles",
    complexity: "Hard",
    summary: "Subtypes must be substitutable for their base types without altering correctness. Subclasses must honor the base class contract.",
    explanation: "The Liskov Substitution Principle (LSP) governs correct inheritance design. It states that an object of a superclass should be replaceable with an object of a subclass without breaking the application logic. Violating LSP usually occurs when a subclass restricts behavior, throws unsupported exceptions on base methods, or violates pre-conditions and post-conditions.",
    umlStructure: `                 +--------------------------+
                 |       FlyingBird         |
                 +--------------------------+
                 | + fly(): void            |
                 +--------------------------+
                              ^
            +-----------------+-----------------+
            |                                   |
+-----------------------+           +-----------------------+
|        Sparrow        |           |        Ostrich        |  <-- VIOLATION: Ostrich cannot fly!
+-----------------------+           +-----------------------+
| + fly(): void         |           | + fly(): throws Error |
+-----------------------+           +-----------------------+

CORRECT STRUCTURE:
                 +--------------------------+
                 |           Bird           |  <-- General interface (no fly method)
                 +--------------------------+
                              ^
            +-----------------+-----------------+
            |                                   |
+-----------------------+           +-----------------------+
|      FlyingBird       |           |     NonFlyingBird     |  <-- Specific interfaces
+-----------------------+           +-----------------------+
| + fly(): void         |           | + walk(): void        |
+-----------------------+           +-----------------------+`,
    beforeCode: `// VIOLATION: Rectangle and Square. Subclassing Square from Rectangle breaks LSP
// because changing the width of a Square implicitly alters its height.
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  setWidth(w) { this.width = w; }
  setHeight(h) { this.height = h; }
  getArea() { return this.width * this.height; }
}

class Square extends Rectangle {
  // Overriding behaves unexpectedly:
  setWidth(w) {
    this.width = w;
    this.height = w; // Mutating height breaks Rectangle contract!
  }
  setHeight(h) {
    this.width = h;
    this.height = h;
  }
}

// Client function assuming Rectangle contract:
function verifyArea(rect) {
  rect.setWidth(5);
  rect.setHeight(4);
  if (rect.getArea() !== 20) {
    console.error("FAIL: Area is not 20! Subtype broke contract.");
  }
}`,
    afterCode: `// COMPLIANT: Rectangle and Square should not inherit from each other directly
// if their mutators conflict. Instead, extract a common read-only interface or separate them.

class Shape {
  getArea() {
    throw new Error("getArea() must be implemented");
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(side) {
    super();
    this.side = side;
  }

  getArea() {
    return this.side * this.side;
  }
}

// Usage:
const rect = new Rectangle(5, 4);
const sq = new Square(5);

console.log(\`Rectangle Area: \${rect.getArea()}\`); // 20
console.log(\`Square Area: \${sq.getArea()}\`);    // 25`,
    tradeoffs: "LSP helps maintain predictable behavior in subclass configurations. Relational models (like mathematical Squares and Rectangles) do not translate directly to Object-Oriented inheritance model IS-A rules when state mutations are involved. Designing with interfaces rather than concrete inheritance trees is a safe way to prevent LSP issues."
  },
  {
    id: 4,
    title: "Interface Segregation Principle (ISP)",
    category: "SOLID Principles",
    complexity: "Medium",
    summary: "Clients should not be forced to depend on interfaces they do not use. Prefer small, highly focused client interfaces.",
    explanation: "Interface Segregation Principle (ISP) states that large interfaces should be broken down into smaller, more specific ones so that clients only need to implement methods they actually use. This avoids 'fat' or 'polluted' interfaces, reducing dependencies and the impact of changes.",
    umlStructure: `FAT INTERFACE (VIOLATION):
+-------------------------------+
|         SmartDevice           |
+-------------------------------+
| + print(doc): void            |
| + scan(doc): void             |
| + fax(doc): void              |
+-------------------------------+

SEGREGATED INTERFACES (COMPLIANT):
+---------------+  +---------------+  +---------------+
|    Printer    |  |    Scanner    |  |  FaxMachine   |
+---------------+  +---------------+  +---------------+
| + print(): vd |  | + scan(): vd  |  | + fax(): vd   |
+---------------+  +---------------+  +---------------+`,
    beforeCode: `// VIOLATION: SmartDevice interface is too broad.
// A simple BasicPrinter is forced to implement dummy methods it cannot support.
class SmartDevice {
  print(doc) { throw new Error("Not implemented"); }
  scan(doc) { throw new Error("Not implemented"); }
  fax(doc) { throw new Error("Not implemented"); }
}

class BasicPrinter extends SmartDevice {
  print(doc) {
    console.log(\`Printing document: \${doc}\`);
  }
  // Forced dummy overrides:
  scan(doc) {
    throw new Error("Hardware scanning not supported!");
  }
  fax(doc) {
    throw new Error("Fax line unavailable!");
  }
}`,
    afterCode: `// COMPLIANT: Segment interfaces into narrow contracts. Classes only implement what they use.

class Printer {
  print(doc) {
    throw new Error("print() must be implemented");
  }
}

class Scanner {
  scan(doc) {
    throw new Error("scan() must be implemented");
  }
}

// Concrete Implementations:
class SimpleInkjet extends Printer {
  print(doc) {
    console.log(\`Inkjet printing: \${doc}\`);
  }
}

class PhotoScanner extends Scanner {
  scan(doc) {
    console.log(\`Scanning photo to digital image...\`);
  }
}

// Multi-function copier implements multiple interfaces (simulated via multiple inheritance/mixins):
class OfficeSuite {
  constructor() {
    this.printer = new SimpleInkjet();
    this.scanner = new PhotoScanner();
  }

  print(doc) { this.printer.print(doc); }
  scan(doc) { this.scanner.scan(doc); }
}`,
    tradeoffs: "Granularity vs Convenience: Extremely segmented interfaces (e.g., interfaces containing only one method each) can make class construction verbose. However, in large team projects, ISP is highly effective because modifying a method signature in a narrow interface only triggers compilation updates in classes directly using that interface, leaving other clients untouched."
  },
  {
    id: 5,
    title: "Dependency Inversion Principle (DIP)",
    category: "SOLID Principles",
    complexity: "Hard",
    summary: "High-level modules should not depend on low-level modules. Both should depend on abstractions. decoupling architectural layers.",
    explanation: "DIP promotes architectural decoupling. If high-level modules (e.g. business managers) directly instantiate or reference low-level components (e.g. specific databases or communication libraries), changes to the low-level elements require rewriting the high-level logic. Placing an interface (abstraction) between them resolves this coupling.",
    umlStructure: `VIOLATION (High-level depends directly on low-level):
+--------------------+
|    OrderManager    |
+--------------------+
          |
          v
+--------------------+
|   MySQLDatabase    |
+--------------------+

COMPLIANT (Both depend on Database Interface):
+--------------------+
|    OrderManager    |
+--------------------+
          |
          v
+--------------------+
|     Database       |  <-- Interface (Abstraction)
+--------------------+
          ^
          |
+--------------------+
|   MySQLDatabase    |  <-- Implementation (Low-level detail)
+--------------------+`,
    beforeCode: `// VIOLATION: OrderManager directly instantiates and depends on MySQLDatabase.
// Switching to MongoDB requires altering the OrderManager source code.
class MySQLDatabase {
  connect() { return "Connected to MySQL"; }
  insertOrder(order) { console.log(\`Inserted order \${order.id} into SQL...\`); }
}

class OrderManager {
  constructor() {
    // Hardcoded direct instantiation:
    this.database = new MySQLDatabase();
  }

  createOrder(order) {
    this.database.connect();
    this.database.insertOrder(order);
  }
}`,
    afterCode: `// COMPLIANT: Depend on abstraction. Inject the database dependency dynamically.

// Abstraction (Contract interface)
class Database {
  connect() {}
  insertOrder(order) {}
}

// Concrete Adapters (Low-level details):
class MySQLDatabase extends Database {
  connect() { console.log("MySQL connecting..."); }
  insertOrder(order) { console.log(\`Inserted order \${order.id} in SQL table.\`); }
}

class MongoDatabase extends Database {
  connect() { console.log("MongoDB connecting..."); }
  insertOrder(order) { console.log(\`Inserted order \${order.id} in BSON collection.\`); }
}

// High-level manager depends ONLY on Database interface:
class OrderManager {
  constructor(database) {
    this.database = database; // Dependency Injection (DI)
  }

  createOrder(order) {
    this.database.connect();
    this.database.insertOrder(order);
  }
}

// Client orchestration:
const mySqlDb = new MySQLDatabase();
const mongoDb = new MongoDatabase();

const managerA = new OrderManager(mySqlDb);
const managerB = new OrderManager(mongoDb);

managerA.createOrder({ id: 991 });
managerB.createOrder({ id: 992 });`,
    tradeoffs: "Boilerplate vs Flexibility: Dependency Inversion requires using Dependency Injection containers or configuring manual initialization parameters, which can increase setup code. However, it is essential for writing clean unit tests because it allows developer to swap the real database database connections with lightweight Mock objects (or in-memory databases) seamlessly."
  },
  {
    id: 6,
    title: "Singleton Pattern",
    category: "Design Patterns",
    complexity: "Easy",
    summary: "Ensures a class has only one instance and provides a global access point to it. Used in logs, config manager, and DB connection pools.",
    explanation: "The Singleton Pattern is a creational pattern that guarantees a class has only one instance throughout the lifetime of the application. It creates a private constructor and exposes a static instance accessor. In multithreaded systems, Double-Checked Locking is used to prevent thread race conditions during initial instantiation.",
    umlStructure: `+-----------------------------------------+
|                Singleton                |
+-----------------------------------------+
| - instance: Singleton                   |  <-- Static private instance
+-----------------------------------------+
| - Singleton()                           |  <-- Private constructor
| + getInstance(): Singleton              |  <-- Static public accessor
+-----------------------------------------+`,
    beforeCode: `// VIOLATION: Multiple instances are instantiated independently.
// This leads to state sync bugs if multiple callers write to different instances.
class DatabaseConnection {
  constructor() {
    this.connectionString = "db://prod_host:5432";
    this.connected = false;
  }
  connect() {
    this.connected = true;
    console.log("Database connection opened.");
  }
}

const conn1 = new DatabaseConnection();
const conn2 = new DatabaseConnection();

conn1.connect();
console.log(conn2.connected); // false (State is out of sync across connections!)`,
    afterCode: `// COMPLIANT: Singleton Pattern ensures only one database connection pool instance is created.

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    
    this.connectionString = "db://prod_host:5432";
    this.connected = false;
    
    DatabaseConnection.instance = this;
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  connect() {
    if (!this.connected) {
      this.connected = true;
      console.log("Database connection pool established.");
    }
  }
}

// Usage:
const conn1 = DatabaseConnection.getInstance();
const conn2 = DatabaseConnection.getInstance();

conn1.connect();
console.log(conn2.connected); // true (Reflects the exact same instance)
console.log(conn1 === conn2);  // true`,
    tradeoffs: "Global State vs Unit Testing: Singletons introduce global state into applications, which can make unit tests interdependent and difficult to parallelize if state isn't reset. In modern web frameworks (like NestJS or Spring), singletons are managed by Dependency Injection containers, which control instances without hardcoding class accessors."
  },
  {
    id: 7,
    title: "Factory Method & Abstract Factory",
    category: "Design Patterns",
    complexity: "Medium",
    summary: "Defines an interface for creating objects, delegating instantiation to subclasses. Abstract Factory builds families of related objects.",
    explanation: "The Factory Method delegates instantiation to subclasses, keeping client code independent of concrete implementation classes. Abstract Factory scales this by creating families of related products (e.g., UI controls for Windows vs macOS) without specifying their concrete classes.",
    umlStructure: `         +--------------------------+
         |      DialogCreator       |  <-- Creator
         +--------------------------+
         | + createButton(): Button |  <-- Factory Method
         +--------------------------+
                       ^
         +-------------+-------------+
         |                           |
+------------------+       +------------------+
|  WindowsDialog   |       |    HTMLDialog    |
+------------------+       +------------------+
| + createButton() |       | + createButton() |
+------------------+       +------------------+`,
    beforeCode: `// VIOLATION: Direct construction of elements. UI logic is hardcoded,
// making it difficult to swap themes or support multiple operating systems.
class WindowsButton { render() { console.log("Rendering Windows-style button"); } }
class MacOSButton { render() { console.log("Rendering macOS-style button"); } }

class Application {
  constructor(osType) {
    this.os = osType;
  }

  renderUI() {
    let button;
    if (this.os === "Windows") {
      button = new WindowsButton();
    } else if (this.os === "macOS") {
      button = new MacOSButton();
    }
    button.render();
  }
}`,
    afterCode: `// COMPLIANT: Use Factory Method/Abstract Factory to encapsulate element generation.

// 1. Interfaces
class Button { render() {} }
class Dialog { createButton() {} }

// 2. Concrete implementations
class WindowsButton extends Button {
  render() { console.log("[Windows Button] drawn."); }
}

class HTMLButton extends Button {
  render() { console.log("[HTML Button] injected in DOM."); }
}

// 3. Creator factories
class WindowsDialog extends Dialog {
  createButton() { return new WindowsButton(); }
}

class HTMLDialog extends Dialog {
  createButton() { return new HTMLButton(); }
}

// Client orchestration:
class UIClient {
  constructor(dialogCreator) {
    this.dialog = dialogCreator;
  }

  render() {
    const btn = this.dialog.createButton();
    btn.render();
  }
}

// Usage:
const windowsClient = new UIClient(new WindowsDialog());
const webClient = new UIClient(new HTMLDialog());

windowsClient.render();
webClient.render();`,
    tradeoffs: "Class Proliferation: Introducing factories increases class count because every new product requires its own creator subclass. If product types change infrequently, using a simple parameterized factory method switch block is more practical than implementing full Abstract Factory class hierarchies."
  },
  {
    id: 8,
    title: "Observer Pattern",
    category: "Design Patterns",
    complexity: "Medium",
    summary: "Establishes a one-to-many subscription mapping where changes in the subject automatically notify all registered observer clients.",
    explanation: "The Observer pattern is a behavioral pattern used to build reactive event systems. A single publisher (Subject) stores a list of subscribers (Observers) and exposes attachment/detachment APIs. When the Subject's state updates, it loops through and triggers a notification callback on all active Observers.",
    umlStructure: `+-----------------------------------------+
|                 Subject                 |
+-----------------------------------------+
| - observers: List<Observer>             |
+-----------------------------------------+
| + attach(o: Observer): void             |
| + detach(o: Observer): void             |
| + notify(): void                        |
+-----------------------------------------+
                     |
                     v (notifies)
+-----------------------------------------+
|                Observer                 |  <-- Interface/Contract
+-----------------------------------------+
| + update(data): void                    |
+-----------------------------------------+`,
    beforeCode: `// VIOLATION: Polling. The Customer class has to call checking loops repeatedly
// to verify if a product is in stock, overloading CPU resources.
class Product {
  constructor(name) {
    this.name = name;
    this.inStock = false;
  }
}

class Customer {
  constructor(name) {
    this.name = name;
  }

  pollStockStatus(product) {
    setInterval(() => {
      if (product.inStock) {
        console.log(\`Success! \${this.name} noticed \${product.name} is in stock.\`);
      }
    }, 1000);
  }
}`,
    afterCode: `// COMPLIANT: Use Observer pattern. The Subject publishes events to active subscribers.

class Subject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notify(data) {
    this.observers.forEach(o => o.update(data));
  }
}

// Subject: Store Inventory
class StoreInventory extends Subject {
  constructor() {
    super();
    this.stock = {};
  }

  restock(itemName, quantity) {
    this.stock[itemName] = (this.stock[itemName] || 0) + quantity;
    console.log(\`Restocked \${itemName} by \${quantity} units.\`);
    this.notify({ item: itemName, quantity });
  }
}

// Observer:
class CustomerObserver {
  constructor(name) {
    this.name = name;
  }

  update(event) {
    console.log(\`Alert to \${this.name}: \${event.item} is in stock! (\${event.quantity} available)\`);
  }
}

// Usage:
const inventory = new StoreInventory();
const customerA = new CustomerObserver("Bob");
const customerB = new CustomerObserver("Charlie");

inventory.attach(customerA);
inventory.attach(customerB);

inventory.restock("PS5", 5);`,
    tradeoffs: "Lapsed Listener Problem (Memory Leaks): Observers must be detached when they are destroyed. If they remain registered in the Subject's list, they cannot be garbage collected, leading to memory leaks. Always execute unsubscribe cleanups in React components/destructors."
  },
  {
    id: 9,
    title: "Strategy Pattern",
    category: "Design Patterns",
    complexity: "Easy",
    summary: "Defines a family of interchangeable algorithms and encapsulates each one, allowing the algorithm to vary independently of clients.",
    explanation: "The Strategy pattern decouples runtime decision paths from class frameworks. Instead of hardcoding conditional sorting, layout, or discount calculations, they are extracted into strategy classes. The client class references a Strategy interface and delegates executions dynamically.",
    umlStructure: `+-----------------------------------------+
|                 Context                 |
+-----------------------------------------+
| - strategy: Strategy                    |
+-----------------------------------------+
| + executeStrategy(): void               |
+-----------------------------------------+
                     |
                     v
+-----------------------------------------+
|                Strategy                 |  <-- Interface
+-----------------------------------------+
| + execute(): void                       |
+-----------------------------------------+
                     ^
         +-----------+-----------+
         |                       |
+-----------------+     +-----------------+
|   StrategyA     |     |   StrategyB     |
+-----------------+     +-----------------+`,
    beforeCode: `// VIOLATION: Nested logic trees. The Navigator class contains complex,
// hardcoded calculations for multiple navigation path algorithms.
class Navigator {
  buildRoute(type, start, end) {
    if (type === "Walk") {
      console.log(\`Calculating walking route from \${start} to \${end}...\`);
      // 50 lines of walking math
    } else if (type === "Road") {
      console.log(\`Calculating driving route from \${start} to \${end}...\`);
      // 50 lines of GPS traffic checks
    } else if (type === "Transit") {
      console.log(\`Calculating train route from \${start} to \${end}...\`);
      // 50 lines of timetables checks
    }
  }
}`,
    afterCode: `// COMPLIANT: Extract routing rules into Strategy classes.

// Interface equivalent
class RouteStrategy {
  build(start, end) {}
}

// Concrete strategies
class WalkingStrategy extends RouteStrategy {
  build(start, end) {
    console.log(\`Walking path: \${start} -> \${end}. Shortest sidewalk metrics applied.\`);
  }
}

class RoadStrategy extends RouteStrategy {
  build(start, end) {
    console.log(\`Road path: \${start} -> \${end}. Live traffic indexes applied.\`);
  }
}

// Navigator client delegates dynamically:
class Navigator {
  constructor(routeStrategy) {
    this.strategy = routeStrategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy; // Change algorithm at runtime
  }

  buildRoute(start, end) {
    this.strategy.build(start, end);
  }
}

// Usage:
const walkRoute = new WalkingStrategy();
const roadRoute = new RoadStrategy();

const nav = new Navigator(walkRoute);
nav.buildRoute("Home", "Office"); // Walking route

nav.setStrategy(roadRoute);
nav.buildRoute("Home", "Office"); // Swapped to driving route`,
    tradeoffs: "Interface Overhead: If your application rarely changes algorithms, strategy patterns can add unnecessary interface configurations. If you are using JavaScript or Python, passing pure high-order callback functions directly satisfies the Strategy pattern without creating full class files."
  },
  {
    id: 10,
    title: "Decorator Pattern",
    category: "Design Patterns",
    complexity: "Medium",
    summary: "Dynamically attaches additional responsibilities to an object. Decorators offer a flexible alternative to subclass inheritance.",
    explanation: "The Decorator pattern wraps target classes with wrapper components implementing the same interface. This allows decorators to intercept method calls, modify arguments, append behaviors (like caching or logging), and delegate the call to the original object recursively.",
    umlStructure: `                 +--------------------------+
                 |        Component         |
                 +--------------------------+
                 | + execute(): String      |
                 +--------------------------+
                   ^                      ^
                   |                      |
+--------------------------+   +--------------------------+
|     ConcreteComponent    |   |     BaseDecorator        |
+--------------------------+   +--------------------------+
| + execute()              |   | - wrapper: Component     |
+--------------------------+   +--------------------------+
                                            ^
                                            |
                               +------------+------------+
                               |                         |
                    +--------------------+    +--------------------+
                    | EncryptionDecorator|    | CompressionDecor   |
                    +--------------------+    +--------------------+`,
    beforeCode: `// VIOLATION: Subclass inheritance explosion.
// Attempting to support multiple feature combinations leads to a massive subclass tree.
class SimpleNotification { send(msg) { console.log(msg); } }

// Combining options (SMS, Slack, SMS+Slack) requires separate subclasses:
class SMSNotification extends SimpleNotification { send(msg) { /* SMS logic */ } }
class SlackNotification extends SimpleNotification { send(msg) { /* Slack logic */ } }
class SMSAndSlackNotification extends SimpleNotification {
  send(msg) {
    // Duplicate logic from SMS and Slack notification classes
  }
}`,
    afterCode: `// COMPLIANT: Use Decorator wrapper pattern to combine features dynamically.

class Component {
  send(msg) {}
}

class BaseNotifier extends Component {
  send(msg) {
    console.log(\`Default Email: \${msg}\`);
  }
}

// Decorator wraps Component
class NotifierDecorator extends Component {
  constructor(component) {
    super();
    this.wrappee = component;
  }

  send(msg) {
    this.wrappee.send(msg);
  }
}

// Concrete Decorators:
class SMSDecorator extends NotifierDecorator {
  send(msg) {
    super.send(msg); // Run wrapped logic
    console.log(\`SMS alert: \${msg}\`);
  }
}

class SlackDecorator extends NotifierDecorator {
  send(msg) {
    super.send(msg);
    console.log(\`Slack ping: \${msg}\`);
  }
}

// Usage: Stack wrappers dynamically
const basicNotifier = new BaseNotifier();
const smsNotifier = new SMSDecorator(basicNotifier);
const multiChannelNotifier = new SlackDecorator(smsNotifier);

multiChannelNotifier.send("Emergency Outage Alert!");`,
    tradeoffs: "Debugging Complexity: Stacking multiple decorators can make debugging difficult because stack traces contain deep recursive calls. Tracking configurations across nested instances requires careful logging. Also, decorators can be difficult to set up if target interfaces have many methods."
  },
  {
    id: 11,
    title: "Code Smells & Refactoring Practices",
    category: "Refactoring Practices",
    complexity: "Hard",
    summary: "Identifies systemic design weaknesses (Bloaters, Object-Orientation Abusers) and applies clean compositions to refactor them.",
    explanation: "Refactoring is the process of improving internal code structure without changing its external behavior. We identify 'Code Smells' (indicators of poor design, like long methods or massive conditionals) and apply standard catalog refactoring patterns (like Extract Method or Replace Conditional with Polymorphism) to clean the code.",
    umlStructure: `REFACTORING STRATEGY WORKFLOW:
1. Identify Code Smell (e.g. Long Method, Feature Envy, Switch Statements)
2. Isolate Logic Blocks into helper functions / Polymorphic classes
3. Run unit tests continuously to ensure behavioral consistency
4. Verify execution metrics (reduced cyclomatic complexity, improved readability)`,
    beforeCode: `// SMELL 1: Long Method & Temp Variables (hard to read and test)
// SMELL 2: Switch Statements checking types (violates OCP)
class OrderBilling {
  constructor(items, type) {
    this.items = items;
    this.customerType = type;
  }

  calculateTotalAndPrintInvoice() {
    let total = 0;
    
    // 1. Calculate price
    for (let i = 0; i < this.items.length; i++) {
      let basePrice = this.items[i].price * this.items[i].quantity;
      if (this.items[i].taxable) {
        basePrice += basePrice * 0.15;
      }
      total += basePrice;
    }

    // 2. Apply customer type discounts
    switch (this.customerType) {
      case "VIP":
        total -= total * 0.10;
        break;
      case "EMPLOYEE":
        total -= total * 0.20;
        break;
    }

    // 3. Print formatting logic inside business logic
    console.log("------------------------");
    console.log(\`TOTAL DUE: $\${total.toFixed(2)}\`);
    console.log("------------------------");
    return total;
  }
}`,
    afterCode: `// COMPLIANT / REFACTORED: Single Responsibility and modularized logic.
// Long methods are extracted, and customer types use polymorphic strategies.

// 1. Encapsulate Discount Strategy
class DiscountStrategy {
  apply(amount) { return amount; }
}

class VipDiscount extends DiscountStrategy {
  apply(amount) { return amount * 0.90; }
}

class EmployeeDiscount extends DiscountStrategy {
  apply(amount) { return amount * 0.80; }
}

class OrderBilling {
  constructor(items, discountStrategy = new DiscountStrategy()) {
    this.items = items;
    this.discountStrategy = discountStrategy;
  }

  // Composed method (high-level readability):
  processBilling() {
    const baseTotal = this.calculateBaseTotal();
    const finalTotal = this.discountStrategy.apply(baseTotal);
    this.printInvoice(finalTotal);
    return finalTotal;
  }

  // Extracted small method:
  calculateBaseTotal() {
    return this.items.reduce((sum, item) => sum + this.getItemPrice(item), 0);
  }

  getItemPrice(item) {
    let price = item.price * item.quantity;
    if (item.taxable) {
      price *= 1.15;
    }
    return price;
  }

  // UI printing separated from calculation:
  printInvoice(total) {
    console.log("------------------------");
    console.log(\`TOTAL DUE: $\${total.toFixed(2)}\`);
    console.log("------------------------");
  }
}`,
    tradeoffs: "Premature Refactoring: Refactoring code too early (before patterns and business requirements are fully understood) can lead to over-engineering. Clean up code only when adding new features or fixing bugs (the 'Rule of Three': refactor when you write similar code for the third time)."
  }
];
