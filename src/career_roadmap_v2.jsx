import { useState } from "react";

const C = {
  blue: "#1a6fd4",
  blueSoft: "#e8f1fb",
  teal: "#0f8a6a",
  tealSoft: "#e0f5ee",
  amber: "#c47a0a",
  amberSoft: "#fdf0d5",
  coral: "#c94a28",
  coralSoft: "#faeae4",
  purple: "#5a3fbf",
  purpleSoft: "#eeeafc",
  green: "#3a7a18",
  greenSoft: "#eaf3de",
  gray: "#555",
  grayBg: "#f6f7f9",
  border: "#e2e6ec",
  text: "#1a1d23",
  muted: "#666",
  white: "#fff",
};

const TAG_STYLES = {
  blue: { background: C.blueSoft, color: C.blue },
  teal: { background: C.tealSoft, color: C.teal },
  amber: { background: C.amberSoft, color: C.amber },
  purple: { background: C.purpleSoft, color: C.purple },
  coral: { background: C.coralSoft, color: C.coral },
  green: { background: C.greenSoft, color: C.green },
};

const MONTHS = [
  {
    num: 1, color: "blue", title: "Java Depth + DSA Foundation", tag: "Fundamentals",
    subtitle: "Stop being a Java user → become a Java engineer. Solve 40+ LeetCode problems.",
    progress: 17,
    weeks: [
      {
        label: "Week 1", title: "Java Internals & Collections",
        items: [
          { text: "JVM architecture: Heap, Stack, Method Area, GC types (G1, ZGC)", links: [
            { name: "JVM Internals – Baeldung", url: "https://www.baeldung.com/jvm-vs-jre-vs-jdk" },
            { name: "JVM Architecture – GfG", url: "https://www.geeksforgeeks.org/jvm-works-jvm-architecture/" },
          ]},
          { text: "String interning, StringBuilder vs String (memory model)", links: [
            { name: "String Pool – Baeldung", url: "https://www.baeldung.com/java-string-pool" },
            { name: "StringBuilder vs String – GfG", url: "https://www.geeksforgeeks.org/string-vs-stringbuilder-vs-stringbuffer-in-java/" },
          ]},
          { text: "Collections deep dive: ArrayList, LinkedList, HashMap internals (bucket, load factor, treeify at size 8)", links: [
            { name: "HashMap Internals – Baeldung", url: "https://www.baeldung.com/java-hashmap" },
            { name: "Java Collections Guide", url: "https://www.baeldung.com/java-collections" },
          ]},
          { text: "HashSet, TreeMap, LinkedHashMap — when to use which and why", links: [
            { name: "TreeMap Guide – Baeldung", url: "https://www.baeldung.com/java-treemap" },
            { name: "LinkedHashMap – Baeldung", url: "https://www.baeldung.com/java-linked-hashmap" },
          ]},
          { text: "equals() vs hashCode() contract — the single most tested Java interview concept", links: [
            { name: "equals & hashCode – Baeldung", url: "https://www.baeldung.com/java-equals-hashcode-contracts" },
          ]},
          { text: "LeetCode: Two Sum, Valid Parentheses, Merge Sorted Arrays, Contains Duplicate (Easy ×8)", links: [
            { name: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" },
            { name: "LeetCode Easy List", url: "https://leetcode.com/problemset/?difficulty=EASY" },
          ]},
        ]
      },
      {
        label: "Week 2", title: "Multithreading & Concurrency",
        items: [
          { text: "Thread lifecycle, Runnable vs Callable vs Thread — differences and use cases", links: [
            { name: "Java Thread Lifecycle – Baeldung", url: "https://www.baeldung.com/java-thread-lifecycle" },
            { name: "Runnable vs Callable – Baeldung", url: "https://www.baeldung.com/java-runnable-callable" },
          ]},
          { text: "synchronized, volatile, wait/notify — what each guarantees and doesn't", links: [
            { name: "synchronized keyword – Baeldung", url: "https://www.baeldung.com/java-synchronized" },
            { name: "volatile keyword – Baeldung", url: "https://www.baeldung.com/java-volatile" },
          ]},
          { text: "ExecutorService, ThreadPoolExecutor, Future — production-level thread management", links: [
            { name: "ExecutorService Guide – Baeldung", url: "https://www.baeldung.com/java-executor-service-tutorial" },
            { name: "ThreadPoolExecutor – Baeldung", url: "https://www.baeldung.com/java-threadpooltaskexecutor-core-vs-max-poolsize" },
          ]},
          { text: "CountDownLatch, Semaphore, CyclicBarrier — when to use each", links: [
            { name: "CountDownLatch Guide", url: "https://www.baeldung.com/java-countdown-latch" },
            { name: "Semaphore Guide", url: "https://www.baeldung.com/java-semaphore" },
          ]},
          { text: "ConcurrentHashMap internals vs HashMap — segment locking vs bucket locking", links: [
            { name: "ConcurrentHashMap – Baeldung", url: "https://www.baeldung.com/java-concurrent-map" },
          ]},
          { text: "LeetCode: Two Pointer problems ×8 (Easy–Medium)", links: [
            { name: "NeetCode Two Pointers", url: "https://neetcode.io/roadmap" },
          ]},
          { text: "Build: Producer-consumer using BlockingQueue — a classic concurrency exercise", links: [
            { name: "BlockingQueue Guide – Baeldung", url: "https://www.baeldung.com/java-blocking-queue" },
          ]},
        ]
      },
      {
        label: "Week 3", title: "Java 8–17 Features",
        items: [
          { text: "Lambda expressions, method references, Functional interfaces (Predicate, Function, Consumer, Supplier)", links: [
            { name: "Lambda Expressions – Baeldung", url: "https://www.baeldung.com/java-8-lambda-expressions-tips" },
            { name: "Functional Interfaces – Baeldung", url: "https://www.baeldung.com/java-8-functional-interfaces" },
          ]},
          { text: "Stream API: map, filter, reduce, collect, flatMap, groupingBy — master these 7", links: [
            { name: "Stream API Guide – Baeldung", url: "https://www.baeldung.com/java-8-streams" },
            { name: "Collectors Guide – Baeldung", url: "https://www.baeldung.com/java-8-collectors" },
          ]},
          { text: "Optional — proper usage, avoid orElse() anti-pattern for expensive fallbacks", links: [
            { name: "Optional Guide – Baeldung", url: "https://www.baeldung.com/java-optional" },
          ]},
          { text: "Records (Java 16+), Sealed classes, Pattern matching instanceof", links: [
            { name: "Java Records – Baeldung", url: "https://www.baeldung.com/java-record-keyword" },
            { name: "Sealed Classes – Baeldung", url: "https://www.baeldung.com/java-sealed-classes-interfaces" },
          ]},
          { text: "LeetCode: Sliding Window problems ×8", links: [
            { name: "NeetCode Sliding Window", url: "https://neetcode.io/roadmap" },
          ]},
          { text: "Practice: Rewrite actual Intellect code using Streams — compare old vs new style", links: [
            { name: "Stream vs Loop – Baeldung", url: "https://www.baeldung.com/java-streams-vs-loops" },
          ]},
        ]
      },
      {
        label: "Week 4", title: "DSA: Arrays, Sorting, Binary Search, Recursion",
        items: [
          { text: "Big-O analysis — practice calculating time AND space complexity for every problem you solve", links: [
            { name: "Big-O Cheat Sheet", url: "https://www.bigocheatsheet.com/" },
            { name: "Complexity Analysis – GfG", url: "https://www.geeksforgeeks.org/analysis-of-algorithms-set-1-asymptotic-analysis/" },
          ]},
          { text: "Sorting: understand BubbleSort, master MergeSort + QuickSort implementation", links: [
            { name: "Sorting Algorithms – GfG", url: "https://www.geeksforgeeks.org/sorting-algorithms/" },
            { name: "Visualgo Sorting (visual)", url: "https://visualgo.net/en/sorting" },
          ]},
          { text: "Binary Search: standard pattern + variations (first/last occurrence, rotated array)", links: [
            { name: "Binary Search – NeetCode", url: "https://neetcode.io/roadmap" },
            { name: "Binary Search Patterns – GfG", url: "https://www.geeksforgeeks.org/binary-search/" },
          ]},
          { text: "Recursion fundamentals — factorial, fibonacci, subset generation, backtracking intro", links: [
            { name: "Recursion Guide – GfG", url: "https://www.geeksforgeeks.org/recursion/" },
            { name: "Backtracking – GfG", url: "https://www.geeksforgeeks.org/backtracking-algorithms/" },
          ]},
          { text: "LeetCode: 12 problems — mix Easy and Medium on Arrays + Binary Search", links: [
            { name: "NeetCode Arrays", url: "https://neetcode.io/roadmap" },
          ]},
          { text: "Weekend: Write a Notion page summarizing Month 1 — teach it as if explaining to a junior", links: [
            { name: "Notion (free)", url: "https://www.notion.so" },
          ]},
        ]
      },
    ],
    cheatsheet: [
      "HashMap: O(1) avg get/put. Treeify at bucket size 8. Load factor 0.75",
      "ArrayList: O(1) get, O(n) insert. LinkedList: O(1) insert, O(n) get",
      "synchronized = monitor lock (atomicity + visibility). volatile = visibility only, no atomicity",
      "Stream.filter() is lazy. Terminal ops (collect, forEach) trigger execution",
      "String is immutable. Stored in String pool. new String() creates heap object, not pool",
      "equals() + hashCode() contract: if a.equals(b) → a.hashCode() == b.hashCode() (always!)",
      "ThreadPoolExecutor params: corePoolSize, maxPoolSize, keepAlive, queue strategy",
      "Binary Search: left=0, right=n-1, while(left<=right), mid=left+(right-left)/2",
      "MergeSort: O(n log n) always. QuickSort: O(n log n) avg, O(n²) worst case",
      "Optional.orElseGet(() -> expensive()) is lazy. orElse(expensive()) always evaluates",
    ],
    resources: [
      { type: "Primary", name: "NeetCode 150 on LeetCode", desc: "Follow NeetCode roadmap strictly", url: "https://neetcode.io/roadmap" },
      { type: "Reading", name: "Baeldung.com", desc: "Best Java internals articles online", url: "https://www.baeldung.com/java-collections" },
      { type: "Video", name: "Java Brains YouTube", desc: "JVM, Spring, Concurrency explained well", url: "https://www.youtube.com/@Java.Brains" },
      { type: "Practice", name: "GeeksforGeeks Java", desc: "Topic-wise practice problems", url: "https://www.geeksforgeeks.org/java/" },
    ],
    qa: [
      {
        q: "Q1: How does HashMap handle hash collisions?",
        a: "HashMap uses chaining (linked list per bucket). When two keys hash to the same index, they're stored as a chain. From Java 8+, if a chain exceeds length 8 AND table size ≥ 64, it converts to a Red-Black Tree for O(log n) lookup instead of O(n). When elements are removed and chain shrinks below 6, it converts back to linked list."
      },
      {
        q: "Q2: Difference between synchronized and ReentrantLock?",
        a: "synchronized: JVM built-in, automatic release on block exit, no fairness control. ReentrantLock: offers tryLock() (non-blocking attempt), lockInterruptibly() (can be interrupted while waiting), fairness policy (FIFO queue), and multiple Condition variables. Use ReentrantLock when you need these advanced features; synchronized for simpler cases."
      },
      {
        q: "Q3: What is the equals/hashCode contract?",
        a: "Rule 1: If a.equals(b) is true, then a.hashCode() MUST equal b.hashCode(). Rule 2: Equal hashCodes don't guarantee equals() (collision is fine). Never break Rule 1 — it silently breaks HashMap, HashSet, and all hash-based collections. IDE-generated equals/hashCode is usually safe."
      },
      {
        q: "Q4: Explain Java memory — where do objects live?",
        a: "Stack: local variables, method frames, object references (per thread, not shared). Heap: actual objects and arrays (shared across threads — race conditions happen here). MetaSpace: class metadata, static variables, compiled bytecode. String Pool: part of heap since Java 7. GC operates only on Heap."
      },
      {
        q: "Q5: What does volatile guarantee and NOT guarantee?",
        a: "volatile guarantees: visibility (all threads see latest value, bypasses CPU cache) and ordering (no reordering around volatile read/write). Does NOT guarantee atomicity. So volatile int count; count++ is still a race condition — it's 3 operations (read, increment, write). Use AtomicInteger for atomic increment."
      },
      {
        q: "Q6: flatMap() vs map() in Streams?",
        a: "Use flatMap when each element maps to a Stream (not a single value) and you want to flatten. Example: List<String> sentences → flatMap(s -> Arrays.stream(s.split(' '))) gives flat Stream<String> of words. map() would give Stream<String[]>. Rule: if your map function returns Stream<T>, use flatMap instead."
      },
      {
        q: "Q7: Time complexity of Binary Search and why?",
        a: "O(log n). Each iteration halves the search space. Starting with n elements: after 1 step → n/2, after 2 → n/4, after k steps → n/2^k = 1, so k = log₂(n). Space: O(1) iterative, O(log n) recursive due to call stack. Always prefer iterative in interviews to avoid stack overflow on large inputs."
      },
    ]
  },
  {
    num: 2, color: "teal", title: "Core CS: SQL, OOP, OS, Networking", tag: "Core CS",
    subtitle: "Ace every CS fundamental question. Master SQL for any query asked in interviews.",
    progress: 33,
    weeks: [
      {
        label: "Week 1", title: "SQL Deep Dive",
        items: [
          { text: "JOINs mastery: INNER, LEFT, RIGHT, FULL, CROSS, SELF — write 10 queries of each type", links: [
            { name: "SQL JOINs – SQLZoo", url: "https://sqlzoo.net/wiki/The_JOIN_operation" },
            { name: "Visual JOINs – C.L. Moffatt", url: "https://www.codeproject.com/Articles/33052/Visual-Representation-of-SQL-Joins" },
          ]},
          { text: "Subqueries: correlated vs non-correlated, EXISTS vs IN — understand the performance difference", links: [
            { name: "Subqueries – GfG", url: "https://www.geeksforgeeks.org/sql-subquery/" },
            { name: "EXISTS vs IN – Baeldung", url: "https://www.baeldung.com/sql/exists-vs-in" },
          ]},
          { text: "Window functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), NTILE() — all with examples", links: [
            { name: "Window Functions – Mode", url: "https://mode.com/sql-tutorial/sql-window-functions/" },
            { name: "Window Fns – PostgreSQL docs", url: "https://www.postgresql.org/docs/current/tutorial-window.html" },
          ]},
          { text: "GROUP BY with HAVING — why WHERE can't replace HAVING for aggregates", links: [
            { name: "GROUP BY & HAVING – SQLZoo", url: "https://sqlzoo.net/wiki/SUM_and_COUNT" },
          ]},
          { text: "Indexes: B-Tree internals, when to create, composite index column order matters", links: [
            { name: "Indexes Deep Dive – Use The Index, Luke", url: "https://use-the-index-luke.com/" },
            { name: "PostgreSQL Indexes", url: "https://www.postgresql.org/docs/current/indexes.html" },
          ]},
          { text: "Practice: sqlzoo.net + HackerRank SQL — complete 30 problems this week", links: [
            { name: "SQLZoo", url: "https://sqlzoo.net" },
            { name: "HackerRank SQL", url: "https://www.hackerrank.com/domains/sql" },
          ]},
        ]
      },
      {
        label: "Week 2", title: "SQL Advanced + DB Transactions",
        items: [
          { text: "Transactions: ACID properties with concrete real-world examples for each letter", links: [
            { name: "ACID Transactions – Baeldung", url: "https://www.baeldung.com/cs/transactions-intro" },
          ]},
          { text: "Isolation levels: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE", links: [
            { name: "Isolation Levels – Baeldung", url: "https://www.baeldung.com/transaction-configuration-with-jpa-and-spring" },
            { name: "Isolation Levels – PostgreSQL", url: "https://www.postgresql.org/docs/current/transaction-iso.html" },
          ]},
          { text: "Deadlocks — how they form, how DBs detect (wait-for graph) and resolve (victim selection)", links: [
            { name: "Deadlocks Explained – GfG", url: "https://www.geeksforgeeks.org/deadlock-in-dbms/" },
          ]},
          { text: "Normalization: 1NF, 2NF, 3NF, BCNF with examples + when to denormalize for performance", links: [
            { name: "Normalization – GfG", url: "https://www.geeksforgeeks.org/normal-forms-in-dbms/" },
          ]},
          { text: "EXPLAIN / EXPLAIN ANALYZE — learn to read query execution plans (seq scan vs index scan)", links: [
            { name: "EXPLAIN guide – PostgreSQL", url: "https://www.postgresql.org/docs/current/using-explain.html" },
            { name: "explain.dalibo.com (visual)", url: "https://explain.dalibo.com/" },
          ]},
          { text: "Stored procedures vs functions vs triggers — understand all three for production context", links: [
            { name: "Stored Procedures – GfG", url: "https://www.geeksforgeeks.org/what-is-stored-procedures-in-sql/" },
          ]},
        ]
      },
      {
        label: "Week 3", title: "OOP Principles + Design Patterns",
        items: [
          { text: "SOLID principles — one concrete Java example you wrote yourself for each (not textbook examples)", links: [
            { name: "SOLID in Java – Baeldung", url: "https://www.baeldung.com/solid-principles" },
            { name: "SOLID Explained – DigitalOcean", url: "https://www.digitalocean.com/community/conceptual-articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design" },
          ]},
          { text: "Design Patterns: Singleton, Factory, Builder, Observer, Strategy, Decorator — implement each", links: [
            { name: "Refactoring.guru Patterns", url: "https://refactoring.guru/design-patterns/java" },
            { name: "Design Patterns – Baeldung", url: "https://www.baeldung.com/design-patterns-series" },
          ]},
          { text: "Singleton pitfalls in multithreading — double-checked locking with volatile field", links: [
            { name: "Singleton Pattern – Baeldung", url: "https://www.baeldung.com/java-singleton" },
          ]},
          { text: "Builder pattern — why it beats telescoping constructors for objects with many optional fields", links: [
            { name: "Builder Pattern – Refactoring.guru", url: "https://refactoring.guru/design-patterns/builder" },
          ]},
          { text: "LeetCode: Trees (BFS, DFS, in/pre/post order traversal) — 10 problems", links: [
            { name: "NeetCode Trees section", url: "https://neetcode.io/roadmap" },
            { name: "Visualgo Tree Traversal", url: "https://visualgo.net/en/bst" },
          ]},
          { text: "Draw class diagrams for 3 design patterns on paper — whiteboard ability impresses interviewers", links: [
            { name: "draw.io (free)", url: "https://www.drawio.com" },
            { name: "Excalidraw (free)", url: "https://excalidraw.com" },
          ]},
        ]
      },
      {
        label: "Week 4", title: "OS + Networking Fundamentals",
        items: [
          { text: "OS: Process vs Thread, context switching cost, scheduling algorithms (FCFS, Round Robin, Priority)", links: [
            { name: "OS Concepts – GfG", url: "https://www.geeksforgeeks.org/operating-systems/" },
            { name: "Process vs Thread – GfG", url: "https://www.geeksforgeeks.org/difference-between-process-and-thread/" },
          ]},
          { text: "Deadlock: four Coffman conditions, detection, prevention strategies", links: [
            { name: "Deadlock – GfG", url: "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/" },
          ]},
          { text: "Virtual memory, paging, page faults, TLB — high-level conceptual understanding", links: [
            { name: "Virtual Memory – GfG", url: "https://www.geeksforgeeks.org/virtual-memory-in-operating-system/" },
          ]},
          { text: "Networking: TCP vs UDP trade-offs, 3-way handshake steps, TIME_WAIT state purpose", links: [
            { name: "TCP vs UDP – Cloudflare", url: "https://www.cloudflare.com/learning/ddos/glossary/user-datagram-protocol-udp/" },
            { name: "TCP Handshake – MDN", url: "https://developer.mozilla.org/en-US/docs/Glossary/TCP_handshake" },
          ]},
          { text: "HTTP/HTTPS: full request-response lifecycle, all status code groups (2xx/3xx/4xx/5xx), key headers", links: [
            { name: "HTTP Status Codes – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" },
            { name: "HTTP Overview – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
          ]},
          { text: "DNS resolution chain, CDN concepts, Load Balancer types — essential for system design", links: [
            { name: "How DNS Works – Cloudflare", url: "https://www.cloudflare.com/learning/dns/what-is-dns/" },
            { name: "CDN Explained – Cloudflare", url: "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/" },
          ]},
          { text: "LeetCode: Graph BFS/DFS — 8 problems", links: [
            { name: "NeetCode Graphs", url: "https://neetcode.io/roadmap" },
          ]},
        ]
      },
    ],
    cheatsheet: [
      "ACID: Atomicity(all-or-nothing), Consistency(valid state always), Isolation(no dirty reads), Durability(persisted after commit)",
      "Window fns: ROW_NUMBER unique always, RANK skips after ties, DENSE_RANK never skips, PARTITION BY resets counter",
      "Composite index on (a,b,c): queries on a, (a,b), (a,b,c) use it. b alone or c alone do NOT",
      "SOLID: S=one reason to change, O=open/closed, L=substitutable subclass, I=small interfaces, D=inject don't instantiate",
      "Singleton thread-safe: private volatile instance + synchronized block OR use enum singleton (simplest)",
      "TCP handshake: SYN → SYN-ACK → ACK. 4-way close: FIN→ACK→FIN→ACK then TIME_WAIT",
      "HTTP codes: 200 OK, 201 Created, 301 Redirect, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Error",
      "Process isolation = separate memory space. Threads share heap, own stack. IPC: pipes/sockets/shared memory",
      "Correlated subquery: executes once per outer row (slow). Rewrite as JOIN or EXISTS for performance",
      "EXISTS stops at first match. IN fetches all matching rows. EXISTS faster for large subquery results",
    ],
    resources: [
      { type: "SQL Practice", name: "SQLZoo", desc: "Best structured SQL practice", url: "https://sqlzoo.net/wiki/SQL_Tutorial" },
      { type: "SQL Practice", name: "HackerRank SQL", desc: "Graded SQL challenges", url: "https://www.hackerrank.com/domains/sql" },
      { type: "OS/Networking", name: "CS75 Harvard (YouTube)", desc: "Free, clear, thorough lectures", url: "https://www.youtube.com/playlist?list=PLvJoKWRPIu8G6Si7LUs6idVFB8yiuwHJZ" },
      { type: "Design Patterns", name: "Refactoring.guru", desc: "Best visual pattern explanations", url: "https://refactoring.guru/design-patterns" },
      { type: "LeetCode", name: "NeetCode Trees + Graphs", desc: "Follow the curated list", url: "https://neetcode.io/roadmap" },
    ],
    qa: [
      {
        q: "Q1: Difference between RANK() and DENSE_RANK()?",
        a: "Both rank rows by ORDER BY. RANK() skips numbers after ties: 1,2,2,4 (skips 3). DENSE_RANK() never skips: 1,2,2,3. Use DENSE_RANK when you want 'top 3 earners' regardless of ties. Use RANK when you want actual position count including ties."
      },
      {
        q: "Q2: Explain REPEATABLE READ isolation level",
        a: "If transaction T1 reads rows matching a condition, other transactions can't modify those specific rows until T1 commits. Prevents dirty reads and non-repeatable reads. However, phantom reads can still occur — T2 can INSERT new rows matching T1's condition. MySQL InnoDB default. SERIALIZABLE prevents phantom reads too but with highest locking cost."
      },
      {
        q: "Q3: Open/Closed Principle with a real example",
        a: "Code open for extension, closed for modification. Payment processing without OCP: if/else for PayPal, Stripe, UPI — adding PhonePe requires modifying existing code. With OCP: PaymentProcessor interface, each method implements it. To add PhonePe: new class, zero changes to existing code. Your production alert system is another example: new alert type = new class, not editing existing alert logic."
      },
      {
        q: "Q4: What happens during TCP connection teardown?",
        a: "4-way handshake: 1) Client sends FIN (done sending data). 2) Server sends ACK (got it, but may have more to send). 3) Server sends FIN (done sending). 4) Client sends ACK. Client then enters TIME_WAIT for 2×MSL (~120 seconds) to ensure server got the final ACK before releasing the port. This prevents old packets from interfering with new connections on same port."
      },
      {
        q: "Q5: What is index selectivity and why does it matter?",
        a: "Selectivity = distinct values / total rows. High selectivity (close to 1.0) → index is very useful (user_id). Low selectivity (gender column: 0.5) → full table scan may be faster than index + random I/O row lookups. DB optimizer uses statistics to decide. Boolean columns and low-cardinality status fields rarely benefit from standalone indexes."
      },
    ]
  },
  {
    num: 3, color: "amber", title: "Spring Boot + REST APIs + Cloud", tag: "Backend Build",
    subtitle: "Build and deploy a real REST API. This is where you become a developer, not just support.",
    progress: 50,
    weeks: [
      {
        label: "Week 1", title: "Spring Core & Boot Foundations",
        items: [
          { text: "Spring IoC container — BeanFactory vs ApplicationContext, what 'inversion of control' actually means", links: [
            { name: "Spring IoC – Baeldung", url: "https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring" },
            { name: "Spring Guides – spring.io", url: "https://spring.io/guides" },
          ]},
          { text: "Dependency Injection: constructor vs setter vs field injection — why constructor injection is preferred", links: [
            { name: "DI in Spring – Baeldung", url: "https://www.baeldung.com/spring-dependency-injection" },
          ]},
          { text: "Bean scopes: Singleton (default), Prototype, Request, Session — when each applies", links: [
            { name: "Bean Scopes – Baeldung", url: "https://www.baeldung.com/spring-bean-scopes" },
          ]},
          { text: "@SpringBootApplication internals — auto-configuration, component scanning, @EnableAutoConfiguration", links: [
            { name: "Spring Boot Auto-config – Baeldung", url: "https://www.baeldung.com/spring-boot-auto-configuration" },
          ]},
          { text: "@Component, @Service, @Repository, @Controller — semantic differences, not just annotations", links: [
            { name: "Spring Annotations – Baeldung", url: "https://www.baeldung.com/spring-component-repository-service" },
          ]},
          { text: "Build: Spring Boot app with H2 in-memory DB, CRUD on one entity, running locally", links: [
            { name: "Spring Boot + H2 Guide", url: "https://spring.io/guides/gs/accessing-data-jpa/" },
            { name: "Amigoscode Spring Boot Tutorial", url: "https://www.youtube.com/@amigoscode" },
          ]},
        ]
      },
      {
        label: "Week 2", title: "REST API Design + Spring MVC",
        items: [
          { text: "REST principles: statelessness, uniform interface, resource naming conventions (/users not /getUsers)", links: [
            { name: "REST API Design – Baeldung", url: "https://www.baeldung.com/rest-with-spring-series" },
            { name: "REST Best Practices – Microsoft", url: "https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design" },
          ]},
          { text: "@RestController, @RequestMapping, @PathVariable, @RequestParam, @RequestBody — all with examples", links: [
            { name: "Spring MVC Annotations – Baeldung", url: "https://www.baeldung.com/spring-mvc-annotations" },
          ]},
          { text: "HTTP verb semantics: GET (safe+idempotent), POST, PUT (idempotent), PATCH (partial), DELETE", links: [
            { name: "HTTP Methods – MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods" },
          ]},
          { text: "Exception handling: @ControllerAdvice + @ExceptionHandler, ProblemDetail (RFC 7807) format", links: [
            { name: "Exception Handling in Spring – Baeldung", url: "https://www.baeldung.com/exception-handling-for-rest-with-spring" },
          ]},
          { text: "Bean Validation: @Valid, @NotNull, @Size, custom validators, validation error response format", links: [
            { name: "Spring Validation – Baeldung", url: "https://www.baeldung.com/spring-boot-bean-validation" },
          ]},
          { text: "Build: Task Management REST API — users, tasks, assignments with proper structured error responses", links: [
            { name: "Building a REST Service – spring.io", url: "https://spring.io/guides/gs/rest-service/" },
          ]},
        ]
      },
      {
        label: "Week 3", title: "JPA/Hibernate + Spring Security + JWT",
        items: [
          { text: "JPA entity lifecycle: transient → persistent → detached → removed — what each state means", links: [
            { name: "JPA Entity Lifecycle – Baeldung", url: "https://www.baeldung.com/hibernate-entity-lifecycle" },
          ]},
          { text: "FetchType LAZY vs EAGER — why LAZY is almost always the right default", links: [
            { name: "LAZY vs EAGER – Baeldung", url: "https://www.baeldung.com/hibernate-lazy-eager-loading" },
          ]},
          { text: "N+1 problem: how to detect (check SQL logs), fix with JOIN FETCH or @EntityGraph", links: [
            { name: "N+1 Problem – Baeldung", url: "https://www.baeldung.com/hibernate-common-performance-problems-in-logs" },
            { name: "@EntityGraph – Baeldung", url: "https://www.baeldung.com/jpa-entity-graph" },
          ]},
          { text: "@OneToMany, @ManyToOne, @ManyToMany — cascade types, orphanRemoval explained", links: [
            { name: "JPA Relationships – Baeldung", url: "https://www.baeldung.com/jpa-joincolumn-vs-mappedby" },
          ]},
          { text: "Spring Security: authentication vs authorization, SecurityFilterChain configuration", links: [
            { name: "Spring Security – Baeldung", url: "https://www.baeldung.com/security-spring" },
          ]},
          { text: "JWT: header.payload.signature structure, HS256 vs RS256, token validation filter", links: [
            { name: "JWT.io (decode & learn)", url: "https://jwt.io/introduction" },
            { name: "Spring Boot + JWT – Baeldung", url: "https://www.baeldung.com/spring-security-oauth-jwt" },
          ]},
          { text: "Add JWT auth to Task API: /auth/register + /auth/login → token → secured endpoints", links: [
            { name: "JWT Auth Tutorial – Amigoscode", url: "https://www.youtube.com/@amigoscode" },
          ]},
        ]
      },
      {
        label: "Week 4", title: "Docker + AWS Basics + CI/CD",
        items: [
          { text: "AWS core services to understand: EC2, S3, RDS, Lambda, API Gateway, IAM, VPC", links: [
            { name: "AWS Free Tier", url: "https://aws.amazon.com/free/" },
            { name: "AWS Skill Builder (free)", url: "https://skillbuilder.aws" },
          ]},
          { text: "Docker: image vs container, writing a Dockerfile, multi-stage builds (JDK → JRE, reduces image size)", links: [
            { name: "Docker Getting Started", url: "https://docs.docker.com/get-started/" },
            { name: "Dockerizing Spring Boot – Baeldung", url: "https://www.baeldung.com/dockerizing-spring-boot-application" },
          ]},
          { text: "Docker Compose: run your app + PostgreSQL together locally with one command", links: [
            { name: "Docker Compose Docs", url: "https://docs.docker.com/compose/" },
          ]},
          { text: "GitHub Actions: write a workflow that builds, tests, and pushes Docker image on every push", links: [
            { name: "GitHub Actions Docs", url: "https://docs.github.com/en/actions" },
            { name: "Java CI with GitHub Actions", url: "https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-java-with-maven" },
          ]},
          { text: "Deploy your Task API to AWS EC2 free tier or Railway.app (simpler, free)", links: [
            { name: "Railway.app", url: "https://railway.app" },
            { name: "Deploy to EC2 – AWS Docs", url: "https://aws.amazon.com/getting-started/hands-on/deploy-java-web-app/" },
          ]},
          { text: "Your deployed project = portfolio piece. Write a good GitHub README with architecture diagram", links: [
            { name: "Awesome README examples", url: "https://github.com/matiassingers/awesome-readme" },
          ]},
        ]
      },
    ],
    cheatsheet: [
      "IoC: 'Don't call us, we'll call you'. Spring creates and injects objects — you declare dependencies",
      "Prefer constructor injection: immutable fields, explicit dependencies, testable without Spring context",
      "LAZY loading: fetch related data only on access. Triggers N+1 in loops — fix with JOIN FETCH",
      "JWT: stateless — server validates signature, no DB session lookup. Logout = client discards token",
      "PUT = full replace (send all fields). PATCH = partial update (send only changed fields)",
      "@Transactional: starts transaction before method, commits after return, rolls back on RuntimeException",
      "Docker image = immutable blueprint. Container = running instance. One image → many containers",
      "EC2 = virtual machines. S3 = object/file storage. RDS = managed relational DB. Lambda = serverless",
      "VPC: virtual private network in AWS. Public subnet = internet-facing. Private subnet = DB tier",
      "Multi-stage build: FROM maven AS build → compile → FROM jre → COPY jar. Smaller final image",
    ],
    resources: [
      { type: "Spring", name: "Spring.io Official Guides", desc: "Start here — best structured tutorials", url: "https://spring.io/guides" },
      { type: "Video", name: "Amigoscode YouTube", desc: "Spring Boot, Security, Docker", url: "https://www.youtube.com/@amigoscode" },
      { type: "AWS", name: "AWS Free Tier + Tutorials", desc: "Deploy real projects for free", url: "https://aws.amazon.com/free/" },
      { type: "Deploy", name: "Railway.app (free hosting)", desc: "Easiest free deployment for portfolio", url: "https://railway.app" },
    ],
    qa: [
      {
        q: "Q1: What is the N+1 problem and how do you fix it?",
        a: "Fetching 100 Orders (1 query) then looping and accessing order.getCustomer() for each — fires 100 more queries (LAZY loading). Total: 101 queries. Fixes: 1) JOIN FETCH: 'SELECT o FROM Order o JOIN FETCH o.customer' — one query with join. 2) @EntityGraph: declarative, cleaner. 3) @BatchSize(size=25): Hibernate batches secondary queries. Always use LAZY as default, JOIN FETCH where you know you'll access the relationship."
      },
      {
        q: "Q2: Why prefer constructor injection over field injection?",
        a: "Field injection (@Autowired on field) hides dependencies, requires reflection to test, allows creating objects with null dependencies. Constructor injection: dependencies are explicit in the signature, fields can be final (immutable), easy to unit test (just pass a mock), fails fast at startup if dependency missing. Spring team officially recommends constructor injection."
      },
      {
        q: "Q3: How does JWT authentication work end to end?",
        a: "1) User sends credentials to /auth/login. 2) Server validates, creates JWT: Base64(header.payload) signed with secret key. 3) Returns JWT. 4) Client stores in memory or httpOnly cookie. 5) Each request sends Authorization: Bearer {token}. 6) Server's filter validates signature + expiry, extracts userId/roles, sets SecurityContext. 7) No server-side session — fully stateless, scales horizontally."
      },
      {
        q: "Q4: What are Docker multi-stage builds and why use them?",
        a: "Multiple FROM statements in one Dockerfile. Stage 1 (builder): FROM maven:3.9 with full JDK — compiles app, runs tests. Stage 2 (final): FROM eclipse-temurin:17-jre — only copies the compiled JAR. Result: final image contains only JRE + JAR, not Maven, JDK, source code. Typical reduction: 600MB → 150MB. Smaller images = faster pulls, faster deploys, smaller attack surface."
      },
    ]
  },
  {
    num: 4, color: "purple", title: "System Design: LLD + HLD", tag: "Architecture",
    subtitle: "Design any system confidently in an interview. The biggest differentiator for senior roles.",
    progress: 67,
    weeks: [
      {
        label: "Week 1", title: "LLD: Design Patterns in Practice",
        items: [
          { text: "Design a Parking Lot system — full class diagram, all edge cases, multi-level, fees", links: [
            { name: "Parking Lot LLD – GfG", url: "https://www.geeksforgeeks.org/design-parking-lot-using-ood-principles/" },
          ]},
          { text: "Design an Elevator system — State Machine pattern, scheduling algorithms", links: [
            { name: "Elevator Design – GfG", url: "https://www.geeksforgeeks.org/design-elevator-system-object-oriented-design/" },
          ]},
          { text: "Design a Library Management System — entities, relationships, interfaces, search", links: [
            { name: "Library System LLD – GfG", url: "https://www.geeksforgeeks.org/library-management-system-using-ood-principles/" },
          ]},
          { text: "LLD interview framework: Clarify → Identify entities → Define interfaces → Write code → Discuss tradeoffs", links: [
            { name: "LLD Interview Tips – GfG", url: "https://www.geeksforgeeks.org/low-level-design-lld-interview-questions/" },
          ]},
          { text: "UML: Class diagrams + Sequence diagrams — practice drawing both on paper quickly", links: [
            { name: "UML Class Diagrams – Lucidchart", url: "https://www.lucidchart.com/pages/uml-class-diagram" },
            { name: "draw.io (free tool)", url: "https://www.drawio.com" },
          ]},
          { text: "LeetCode: Dynamic Programming basics — 10 problems (climbing stairs, coin change, 0/1 knapsack)", links: [
            { name: "NeetCode DP section", url: "https://neetcode.io/roadmap" },
            { name: "DP Patterns – Leetcode discuss", url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns" },
          ]},
        ]
      },
      {
        label: "Week 2", title: "HLD: Distributed Systems Fundamentals",
        items: [
          { text: "CAP theorem — Consistency vs Availability trade-off with real examples (Zookeeper=CP, Cassandra=AP)", links: [
            { name: "CAP Theorem – Baeldung", url: "https://www.baeldung.com/cs/cap-theorem" },
            { name: "CAP Theorem Explained – ByteByteGo", url: "https://www.youtube.com/@ByteByteGo" },
          ]},
          { text: "Horizontal vs Vertical scaling — when each applies, cost implications", links: [
            { name: "Scaling – Cloudflare", url: "https://www.cloudflare.com/learning/performance/what-is-auto-scaling/" },
          ]},
          { text: "Load balancing: L4 vs L7, Round Robin, Least Connections, Consistent Hashing algorithm", links: [
            { name: "Load Balancing – Nginx", url: "https://www.nginx.com/resources/glossary/load-balancing/" },
            { name: "Consistent Hashing – ByteByteGo", url: "https://www.youtube.com/@ByteByteGo" },
          ]},
          { text: "Caching strategies: Cache-aside, Write-through, Write-behind, Read-through — trade-offs", links: [
            { name: "Caching Strategies – AWS", url: "https://aws.amazon.com/caching/best-practices/" },
          ]},
          { text: "Redis: in-memory cache, TTL, eviction policies (LRU, LFU), pub/sub, sorted sets", links: [
            { name: "Redis Official Docs", url: "https://redis.io/docs/latest/" },
            { name: "Redis University (free)", url: "https://university.redis.io" },
          ]},
          { text: "CDN: edge caching, cache invalidation (TTL vs event-based), origin shield", links: [
            { name: "CDN Explained – Cloudflare", url: "https://www.cloudflare.com/learning/cdn/what-is-a-cdn/" },
          ]},
        ]
      },
      {
        label: "Week 3", title: "HLD: Databases, Queues, Microservices",
        items: [
          { text: "SQL vs NoSQL — nuanced answer (not 'NoSQL is faster'): access patterns, consistency needs, scale", links: [
            { name: "SQL vs NoSQL – MongoDB", url: "https://www.mongodb.com/resources/compare/relational-vs-non-relational-databases" },
          ]},
          { text: "Database sharding: horizontal partitioning, shard key selection, hot shard problem, resharding cost", links: [
            { name: "DB Sharding – ByteByteGo", url: "https://www.youtube.com/@ByteByteGo" },
            { name: "Sharding – Baeldung", url: "https://www.baeldung.com/cs/database-sharding" },
          ]},
          { text: "Kafka: topics, partitions, consumer groups, offset management, exactly-once semantics", links: [
            { name: "Kafka Official Docs", url: "https://kafka.apache.org/documentation/" },
            { name: "Kafka in 100 Seconds – Fireship", url: "https://www.youtube.com/watch?v=uvb00oaa3k8" },
          ]},
          { text: "Microservices patterns: API Gateway, Service Discovery (Consul/Eureka), Circuit Breaker (Resilience4j)", links: [
            { name: "Microservices Patterns – martinfowler.com", url: "https://martinfowler.com/microservices/" },
            { name: "Resilience4j Docs", url: "https://resilience4j.readme.io/docs/getting-started" },
          ]},
          { text: "Design: URL Shortener (TinyURL) — full system with capacity estimation and data model", links: [
            { name: "URL Shortener Design – Gaurav Sen", url: "https://www.youtube.com/@gkcs" },
          ]},
          { text: "Design: Notification Service — email/SMS/push fan-out, priority queues, retry logic", links: [
            { name: "Notification System – ByteByteGo", url: "https://www.youtube.com/@ByteByteGo" },
          ]},
        ]
      },
      {
        label: "Week 4", title: "HLD: Big System Designs + Observability",
        items: [
          { text: "Design: Twitter-like feed — read-heavy, fanout-on-write vs fanout-on-read, celebrity problem solution", links: [
            { name: "Twitter Feed Design – Gaurav Sen", url: "https://www.youtube.com/@gkcs" },
          ]},
          { text: "Design: Distributed Rate Limiter — token bucket algorithm, Redis sliding window implementation", links: [
            { name: "Rate Limiting – ByteByteGo", url: "https://www.youtube.com/@ByteByteGo" },
          ]},
          { text: "Observability: Metrics (Prometheus + Grafana), Logs (ELK stack), Tracing (Jaeger)", links: [
            { name: "Prometheus Docs", url: "https://prometheus.io/docs/introduction/overview/" },
            { name: "Spring Boot + Prometheus – Baeldung", url: "https://www.baeldung.com/spring-boot-prometheus" },
          ]},
          { text: "SLI/SLO/SLA definitions — how to set error budgets, alerting strategy", links: [
            { name: "SLI/SLO/SLA – Google SRE Book", url: "https://sre.google/sre-book/service-level-objectives/" },
          ]},
          { text: "DB connection pooling: HikariCP settings, pool sizing formula (CPU cores × 2 + effective spindle count)", links: [
            { name: "HikariCP Docs", url: "https://github.com/brettwooldridge/HikariCP" },
            { name: "Pool Sizing – HikariCP wiki", url: "https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing" },
          ]},
          { text: "Interview simulation: 45-minute timer, design Instagram from scratch on paper — full HLD", links: [
            { name: "Excalidraw (draw system diagrams)", url: "https://excalidraw.com" },
            { name: "Instagram Design – ByteByteGo", url: "https://www.youtube.com/@ByteByteGo" },
          ]},
        ]
      },
    ],
    cheatsheet: [
      "Capacity math: 1M DAU × 100 req/day = 100M/day ÷ 86400s ≈ 1200 req/s. Always estimate first",
      "Storage: 1M users × 1KB profile = 1GB. 1M photos/day × 500KB = 500GB/day. Extrapolate 5 years",
      "CAP: Network partition WILL happen. You choose: Consistency (reject writes) or Availability (serve stale)",
      "Cache-aside: App checks cache → miss → query DB → store in cache → return. Most common pattern",
      "Consistent hashing: adding/removing nodes only remaps adjacent keys. Minimizes cache invalidation",
      "Circuit breaker: Closed(normal) → Open(failing fast, no DB hits) → Half-Open(probe one request)",
      "Kafka: Pull-based consumers. Partitions enable parallelism. Consumer group = one message copy per group",
      "Shard key: needs high cardinality + even distribution. Timestamp as shard key = all writes to one shard",
      "Write-through: write to cache + DB synchronously. Strong consistency, write latency cost",
      "HLD interview checklist: Clarify → Estimate → API design → DB schema → Diagram → Deep dive → Tradeoffs",
    ],
    resources: [
      { type: "Must Read", name: "Designing Data-Intensive Apps", desc: "Martin Kleppmann — chapters 5–9", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
      { type: "YouTube", name: "ByteByteGo Channel", desc: "Best visual system design explanations", url: "https://www.youtube.com/@ByteByteGo" },
      { type: "YouTube", name: "Gaurav Sen — System Design", desc: "Deep dives on distributed systems", url: "https://www.youtube.com/@gkcs" },
      { type: "Practice", name: "Excalidraw (free diagramming)", desc: "Draw system diagrams while learning", url: "https://excalidraw.com" },
      { type: "Book", name: "System Design Interview — Alex Xu", desc: "Vol 1 & 2 — buy both", url: "https://www.amazon.in/System-Design-Interview-Insiders-Guide/dp/B08CMF2CQF" },
    ],
    qa: [
      {
        q: "Q1: How would you design a rate limiter?",
        a: "Algorithms: Token Bucket (allows bursts, refill at constant rate — good for APIs), Sliding Window Counter (approximate but memory-efficient), Sliding Window Log (accurate, memory-heavy). Redis implementation: INCR + EXPIRE per user key per time window. Lua script for atomic check-and-increment. Return 429 Too Many Requests with Retry-After header. For distributed systems: Redis is the central state store shared across all API servers."
      },
      {
        q: "Q2: SQL vs NoSQL — give a nuanced answer",
        a: "Choose SQL when: ACID transactions required (payments, banking), complex joins/aggregations needed, schema is stable and relational. Choose NoSQL when: massive write scale (Cassandra), flexible/evolving schema (MongoDB), simple key-value access (Redis), graph relationships (Neo4j). Real answer: most production systems use both — SQL for transactional data, Redis for cache, Elasticsearch for search. Don't frame it as binary in interviews."
      },
      {
        q: "Q3: Explain consistent hashing",
        a: "Normal hashing: key % N servers. When N changes, almost all keys remap — massive cache invalidation. Consistent hashing: place servers on virtual ring (0 to 2^32). Each key maps to first server clockwise on ring. Adding server: only keys between it and predecessor remap. Removing: only that server's keys move to next. Virtual nodes: each physical server = multiple ring positions for better load distribution."
      },
      {
        q: "Q4: How does a circuit breaker work?",
        a: "Three states: Closed (normal operation, all requests pass through, failure count tracked). Open (failure threshold exceeded — requests fail fast without hitting downstream service, avoids cascade failure). Half-Open (after timeout, one probe request sent — if success → Closed, if fail → Open again). Resilience4j implements this in Spring Boot. Set thresholds: 50% failure rate in 10-second window → Open."
      },
    ]
  },
  {
    num: 5, color: "coral", title: "Full Project + AI Tooling + DSA Push", tag: "Build & Ship",
    subtitle: "Ship a real project. Master AI-assisted development. Reach LeetCode Medium comfort.",
    progress: 83,
    weeks: [
      {
        label: "Week 1", title: "Plan Your Capstone Project",
        items: [
          { text: "Choose: Expense Tracker with Analytics / Job Application Tracker / Mini E-commerce API / Finance Dashboard", links: [
            { name: "Project ideas – roadmap.sh", url: "https://roadmap.sh/projects" },
          ]},
          { text: "Write a proper PRD (Product Requirements Document) — this itself is a valuable skill for interviews", links: [
            { name: "How to write a PRD – Product School", url: "https://productschool.com/blog/product-management-2/how-to-write-a-product-requirements-document-prd" },
          ]},
          { text: "Tech stack decision: Spring Boot + PostgreSQL + Redis + React frontend + Docker + GitHub Actions", links: [
            { name: "Spring Boot reference docs", url: "https://docs.spring.io/spring-boot/docs/current/reference/html/" },
          ]},
          { text: "Use GitHub Projects for task management — practice agile workflow visibly on your profile", links: [
            { name: "GitHub Projects docs", url: "https://docs.github.com/en/issues/planning-and-tracking-with-projects" },
          ]},
          { text: "Set up AI tooling: GitHub Copilot or Claude — use AI for boilerplate, test generation", links: [
            { name: "GitHub Copilot", url: "https://github.com/features/copilot" },
            { name: "Claude (Anthropic)", url: "https://claude.ai" },
          ]},
          { text: "LeetCode: Dynamic Programming Medium — 10 problems this week", links: [
            { name: "NeetCode DP section", url: "https://neetcode.io/roadmap" },
            { name: "DP Patterns – LeetCode Discuss", url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns" },
          ]},
        ]
      },
      {
        label: "Week 2–3", title: "Build Core Backend + Frontend",
        items: [
          { text: "Backend: All core APIs with proper error handling, validation, pagination (page + size params)", links: [
            { name: "Spring Boot REST API tutorial", url: "https://spring.io/guides/gs/rest-service/" },
          ]},
          { text: "Frontend: Basic React app consuming your API — doesn't need to be beautiful, needs to work", links: [
            { name: "React official tutorial", url: "https://react.dev/learn" },
            { name: "Vite + React setup", url: "https://vitejs.dev/guide/" },
          ]},
          { text: "Authentication: JWT login/signup flow integrated end to end", links: [
            { name: "Spring Security + JWT – Baeldung", url: "https://www.baeldung.com/spring-security-oauth-jwt" },
          ]},
          { text: "Database: Proper schema with indexes, migrations managed with Flyway (V1__init.sql, V2__...)", links: [
            { name: "Flyway Docs", url: "https://documentation.red-gate.com/fd" },
            { name: "Flyway + Spring Boot – Baeldung", url: "https://www.baeldung.com/database-migrations-with-flyway" },
          ]},
          { text: "Testing: Unit tests with JUnit 5 + Mockito, integration tests with Testcontainers + real PostgreSQL", links: [
            { name: "JUnit 5 + Mockito – Baeldung", url: "https://www.baeldung.com/mockito-junit-5-extension" },
            { name: "Testcontainers for Spring Boot", url: "https://testcontainers.com/guides/testing-spring-boot-rest-api-using-testcontainers/" },
          ]},
          { text: "AI practice: Use Claude to write tests, generate OpenAPI docs, review your architecture choices", links: [
            { name: "Claude (Anthropic)", url: "https://claude.ai" },
            { name: "OpenAPI / Swagger UI", url: "https://swagger.io/tools/swagger-ui/" },
          ]},
        ]
      },
      {
        label: "Week 4", title: "Polish, Deploy, Document, Blog",
        items: [
          { text: "API documentation: OpenAPI/Swagger auto-generated, tested with Swagger UI", links: [
            { name: "Springdoc OpenAPI", url: "https://springdoc.org/" },
          ]},
          { text: "Deploy: Docker Compose on VPS or EC2 + PostgreSQL on RDS free tier", links: [
            { name: "Railway.app (easiest)", url: "https://railway.app" },
            { name: "Deploy to EC2 – AWS Docs", url: "https://aws.amazon.com/getting-started/hands-on/deploy-java-web-app/" },
          ]},
          { text: "Monitoring: Spring Boot Actuator endpoints — /health, /metrics, /info", links: [
            { name: "Spring Actuator – Baeldung", url: "https://www.baeldung.com/spring-boot-actuators" },
          ]},
          { text: "GitHub README: Architecture diagram (draw.io), setup instructions, API examples, tech decisions", links: [
            { name: "Awesome README examples", url: "https://github.com/matiassingers/awesome-readme" },
            { name: "draw.io (free)", url: "https://www.drawio.com" },
          ]},
          { text: "Write a technical blog on Dev.to or Medium about architecture decisions and lessons learned", links: [
            { name: "Dev.to", url: "https://dev.to" },
            { name: "Hashnode", url: "https://hashnode.com" },
          ]},
          { text: "LeetCode: Graphs advanced — 8 Medium problems (Dijkstra, BFS shortest path, topological sort)", links: [
            { name: "NeetCode Graphs section", url: "https://neetcode.io/roadmap" },
          ]},
        ]
      },
      {
        label: "AI Tools", title: "AI-Native Development Habits",
        items: [
          { text: "Code generation: Write precise, context-rich prompts. Include: language, framework, constraints, examples", links: [
            { name: "Anthropic Prompt Engineering Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" },
          ]},
          { text: "Code review with AI: 'What could go wrong at scale?', 'What edge cases am I missing?'", links: [
            { name: "Claude (Anthropic)", url: "https://claude.ai" },
          ]},
          { text: "Architecture review: Describe your system, ask for critique — treat AI as a senior engineer reviewer", links: [
            { name: "Claude (Anthropic)", url: "https://claude.ai" },
          ]},
          { text: "Learning accelerator: Ask AI to explain any concept 3 different ways until it truly clicks", links: [
            { name: "Claude (Anthropic)", url: "https://claude.ai" },
          ]},
          { text: "Interview prep: 'Play the role of a strict FAANG interviewer. Ask me system design questions.'", links: [
            { name: "Pramp — peer mock interviews", url: "https://www.pramp.com" },
            { name: "Interviewing.io", url: "https://interviewing.io" },
          ]},
          { text: "Documentation: Generate technical docs from code, review + refine — don't accept first output", links: [
            { name: "GitHub Copilot", url: "https://github.com/features/copilot" },
          ]},
        ]
      },
    ],
    cheatsheet: [
      "AI best at: boilerplate, test generation, documentation, explaining unfamiliar code, first drafts",
      "You must own: architecture decisions, security review, business logic correctness, performance tradeoffs",
      "Prompt pattern: Context → Constraints → Examples → Task. Never just 'write me X'",
      "Testcontainers: spins up real PostgreSQL in tests. Far more reliable than mocking DB behavior",
      "Flyway migrations: V1__init.sql, V2__add_column.sql — version-controlled, repeatable DB schema changes",
      "Spring Actuator: always add /actuator/health to every production app — load balancers check it",
      "Good README: What it does → Why you built it → Architecture → Setup → API examples → Lessons learned",
      "PRD sections: Problem statement, User stories, Functional requirements, Non-functional requirements, Out of scope",
      "Pagination: always paginate list endpoints. Include: page, size, totalElements, totalPages in response",
    ],
    resources: [
      { type: "AI Tools", name: "Claude (Anthropic)", desc: "Use daily — prompt engineering practice", url: "https://claude.ai" },
      { type: "AI Tools", name: "GitHub Copilot", desc: "In-editor AI code completion", url: "https://github.com/features/copilot" },
      { type: "Testing", name: "Testcontainers.com", desc: "Real DB testing, not mocks", url: "https://testcontainers.com" },
      { type: "Deploy", name: "Railway.app", desc: "Simplest free deployment for portfolio projects", url: "https://railway.app" },
      { type: "Blog", name: "Dev.to", desc: "Publish your learning — builds credibility", url: "https://dev.to" },
      { type: "Blog", name: "Hashnode", desc: "Technical blogging platform for developers", url: "https://hashnode.com" },
    ],
    qa: [
      {
        q: "Q1: How do you approach writing testable code?",
        a: "Design for dependency injection — avoid new SomeService() inside business logic. Use interfaces for external dependencies (DB, HTTP calls, email) — mock the interface in tests. Keep business logic pure (no I/O). Test pyramid: many unit tests (fast, isolated), fewer integration tests (Testcontainers), minimal E2E tests. Name tests: given_when_then pattern. Each test asserts one thing."
      },
      {
        q: "Q2: How do you use AI tools effectively without losing engineering judgment?",
        a: "Use AI for acceleration, not replacement. Always review AI-generated code — it makes subtle logic errors, security mistakes, and doesn't know your domain. Good pattern: write the test first yourself, then use AI to implement, then verify it passes your test. Use AI for: 'explain this unfamiliar code', 'what are edge cases for this function', 'write boilerplate for X pattern'. Never use for: architecture decisions, security-sensitive code without review, anything you can't explain to a teammate."
      },
    ]
  },
  {
    num: 6, color: "green", title: "Interview Sprint + Negotiation", tag: "Get The Offer",
    subtitle: "Apply to 20+ companies, create competing offers, negotiate confidently. This is where it pays off.",
    progress: 100,
    weeks: [
      {
        label: "Week 1–2", title: "Resume, Mock Interviews, Apply",
        items: [
          { text: "Resume: quantify EVERYTHING — 'Reduced P1 incidents by 40% by building automated alert triage'", links: [
            { name: "Resume tips – Tech Interview Handbook", url: "https://www.techinterviewhandbook.org/resume/" },
          ]},
          { text: "Resume: lead with your project — 'Built Task API serving 500 users with Spring Boot, Redis, PostgreSQL'", links: [
            { name: "Resume templates – Overleaf", url: "https://www.overleaf.com/gallery/tagged/cv" },
          ]},
          { text: "LinkedIn: Update fully, connect with 20 Hyderabad tech recruiters, turn on Open to Work", links: [
            { name: "LinkedIn Jobs – Hyderabad", url: "https://www.linkedin.com/jobs/search/?location=Hyderabad" },
          ]},
          { text: "Mock interviews: Pramp.com (free peer mocks), Interviewing.io (anonymous with real engineers)", links: [
            { name: "Pramp (free)", url: "https://www.pramp.com" },
            { name: "Interviewing.io", url: "https://interviewing.io" },
          ]},
          { text: "LeetCode: 3 problems per day — Sliding Window, BFS/DFS, DP, Two Pointer patterns", links: [
            { name: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" },
            { name: "LeetCode 75 list", url: "https://leetcode.com/studyplan/leetcode-75/" },
          ]},
          { text: "Apply to 10 companies immediately — even if not 100% ready. Real interviews = best practice", links: [
            { name: "Naukri.com – Hyderabad jobs", url: "https://www.naukri.com/it-jobs-in-hyderabad" },
            { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/" },
          ]},
        ]
      },
      {
        label: "Week 3–4", title: "Behavioral Prep + Negotiation",
        items: [
          { text: "STAR method: Situation, Task, Action, Result — prepare 8 stories covering leadership, conflict, failure, innovation", links: [
            { name: "STAR method guide – Indeed", url: "https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique" },
          ]},
          { text: "'Tell me about yourself': 2-minute script: current role → what you built → why moving → why this company", links: [
            { name: "Tech Interview Handbook – Behavioral", url: "https://www.techinterviewhandbook.org/behavioral-interview/" },
          ]},
          { text: "Company research: read their engineering blog, know their tech stack, recent product launches", links: [
            { name: "Engineering blogs directory", url: "https://github.com/kilimchoi/engineering-blogs" },
          ]},
          { text: "Salary research: Glassdoor, Levels.fyi, LinkedIn Salary for Hyderabad SDE-2 (₹18–35 LPA at product cos)", links: [
            { name: "Levels.fyi", url: "https://www.levels.fyi" },
            { name: "Glassdoor India", url: "https://www.glassdoor.co.in" },
          ]},
          { text: "Negotiation script: 'I'm excited. I was expecting X based on market research. Is there flexibility?'", links: [
            { name: "Salary negotiation guide – Haseeb Qureshi", url: "https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/" },
          ]},
          { text: "WLB check: ask 'What does on-call look like?', 'How does the team handle work around deadlines?'", links: [
            { name: "Questions to ask interviewers – GitHub", url: "https://github.com/viraptor/reverse-interview" },
          ]},
        ]
      },
      {
        label: "Cheat Sheet", title: "Interview Day Checklist",
        items: [
          { text: "DSA: Think out loud. State brute force first, then optimize. Test with example before coding", links: [
            { name: "Tech Interview Handbook – DSA", url: "https://www.techinterviewhandbook.org/coding-interview-study-plan/" },
          ]},
          { text: "System Design: 5 full minutes clarifying requirements and scale BEFORE drawing anything", links: [
            { name: "System Design Primer – GitHub", url: "https://github.com/donnemartin/system-design-primer" },
          ]},
          { text: "Every behavioral answer ends with a measurable result: '...which led to 30% faster deployments'", links: [
            { name: "STAR method – Indeed", url: "https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique" },
          ]},
          { text: "Ask good questions: 'What does success look like in 6 months here?', 'Biggest technical challenge?'", links: [
            { name: "Reverse interview questions – GitHub", url: "https://github.com/viraptor/reverse-interview" },
          ]},
          { text: "WLB signals: 'What time does the team usually wrap up?', 'How often are there production incidents?'", links: [
            { name: "Culture Amp WLB guide", url: "https://www.cultureamp.com/blog/work-life-balance-questions" },
          ]},
          { text: "Offer evaluation: Base + Bonus + ESOP + WLB + Stack + Team Quality + Growth — weight all factors", links: [
            { name: "Offer evaluation – Levels.fyi", url: "https://www.levels.fyi" },
          ]},
          { text: "Competing offers: 'I have another offer with timeline X, can you expedite?' — this always works", links: [
            { name: "Negotiation tactics – Haseeb Qureshi", url: "https://haseebq.com/my-ten-rules-for-negotiating-a-job-offer/" },
          ]},
          { text: "Market range Hyderabad SDE-2: ₹18–30 LPA at product cos. ₹12–18 LPA at service cos", links: [
            { name: "Glassdoor India salaries", url: "https://www.glassdoor.co.in/Salaries/hyderabad-software-engineer-salary-SRCH_IL.0,9_IM1076_KO10,27.htm" },
          ]},
        ]
      },
      {
        label: "Q&A Bank", title: "Behavioral Interview Q&A",
        items: []
      },
    ],
    cheatsheet: [
      "Quantify everything on resume: numbers, percentages, scale — vague claims are forgettable",
      "DSA in interviews: brute force first → analyze complexity → then optimize. Never skip brute force",
      "System design: always estimate scale before designing — scale drives every architecture decision",
      "STAR: Situation (brief context) → Task (your responsibility) → Action (what YOU did) → Result (measurable)",
      "'Tell me about yourself': past → present → future. End with why this specific company excites you",
      "WLB red flags: 'we work hard, play hard', 'like a family', 'always available' — probe these deeper",
      "First offer is rarely the best offer. 'I need a few days to consider' always buys time to negotiate",
      "Hyderabad SDE-2 target: ₹20–28 LPA base is realistic. ₹30+ at top product cos with strong negotiation",
    ],
    resources: [
      { type: "Mock Interviews", name: "Pramp.com (free)", desc: "Peer-to-peer mock interview platform", url: "https://www.pramp.com" },
      { type: "Mock Interviews", name: "Interviewing.io", desc: "Anonymous mocks with real engineers", url: "https://interviewing.io" },
      { type: "Salary Data", name: "Levels.fyi", desc: "Research Hyderabad SDE-2 salary ranges", url: "https://www.levels.fyi" },
      { type: "Salary Data", name: "Glassdoor", desc: "Company reviews + salary data", url: "https://www.glassdoor.co.in" },
      { type: "Apply", name: "LinkedIn Jobs", desc: "Primary channel — turn on Open to Work", url: "https://www.linkedin.com/jobs/" },
      { type: "Apply", name: "Naukri.com", desc: "Largest Indian job portal", url: "https://www.naukri.com" },
    ],
    qa: [
      {
        q: "Q: Tell me about a complex production issue you solved",
        a: "STAR it with your real Intellect experience: Situation — describe a real P1 incident. Task — your role in it. Action — how you debugged (logs, metrics, code analysis), what you discovered, steps you took. Result — 'Restored service in X minutes, reducing customer impact. I then implemented an automated alert for this pattern, preventing 3 similar incidents over the next quarter.' Your production background is a genuine strength — own it."
      },
      {
        q: "Q: Why are you leaving Intellect?",
        a: "Never say anything negative. Good answer: 'Intellect gave me valuable cross-domain exposure — frontend, backend, SQL, deployments, documentation. I learned how systems work end to end. I'm now looking to go deeper as a developer, build features from scratch, and work in a product-first environment where I own features end to end. I'm excited about [Company]'s engineering culture and the scale of problems they solve.'"
      },
      {
        q: "Q: You lack pure development experience. Why hire you?",
        a: "Reframe confidently: 'My production support background is an asset. I've seen firsthand how code behaves under real load, what breaks and why, how design decisions impact operations. I know what to ask before shipping: what happens when this fails, what do we alert on, how do we roll back. Plus I've built [project] — here's the GitHub link with the deployed app. I'm not starting from zero; I bring battle-tested perspective combined with strong development skills.'"
      },
      {
        q: "Q: Where do you see yourself in 5 years?",
        a: "Be honest and thoughtful: 'I want to grow into a senior engineer who can own and design complex systems end to end, not just implement them. I'm deliberately moving one layer above just writing code — toward systems thinking, architecture, and understanding the business impact of technical decisions. In 5 years, I'd love to be the person a team comes to for technical direction, whether as a staff engineer or in an architecture role.'"
      },
    ]
  }
];

const FUTURE_TRACKS = [
  {
    icon: "🏛️", color: "purple", title: "Software Architecture & Systems Thinking",
    subtitle: "The layer AI can't reach — judgment, trade-offs, constraints",
    desc: "Architects define the structure AI builds into. Learn to make decisions about non-functional requirements (scalability, reliability, cost, security). Study: Domain-Driven Design (DDD), Event-Driven Architecture, Clean Architecture, Hexagonal Architecture (Ports & Adapters). The goal: given a business problem, you design the system; AI writes the code.",
    resources: [
      { name: "Designing Data-Intensive Applications", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
      { name: "Martin Fowler's blog", url: "https://martinfowler.com" },
      { name: "Fundamentals of Software Architecture (book)", url: "https://www.oreilly.com/library/view/fundamentals-of-software/9781492043447/" },
      { name: "InfoQ talks (free)", url: "https://www.infoq.com/presentations/" },
      { name: "DDD Europe YouTube", url: "https://www.youtube.com/@ddd_eu" },
    ],
    timeline: "Start Month 4 — 30 min/day reading habit"
  },
  {
    icon: "🤖", color: "teal", title: "AI/ML Engineering (Applied, Not Research)",
    subtitle: "Build AI-powered products — the highest-demand skill for 2025–2030",
    desc: "Build RAG pipelines, AI agents, LLM-integrated APIs. You don't need to train models. Learn: LangChain/LangGraph, OpenAI API, vector databases (pgvector, Pinecone), embedding models, prompt engineering, evaluation frameworks. Add one AI feature to your Month 5 project: semantic search, AI-summarized reports, or intelligent classification.",
    resources: [
      { name: "fast.ai (free course)", url: "https://www.fast.ai" },
      { name: "DeepLearning.AI short courses", url: "https://www.deeplearning.ai/short-courses/" },
      { name: "Hugging Face docs", url: "https://huggingface.co/docs" },
      { name: "LangChain Academy", url: "https://academy.langchain.com" },
      { name: "Anthropic prompt engineering guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" },
    ],
    timeline: "Start Month 3 experiments, serious Month 5+"
  },
  {
    icon: "⚙️", color: "amber", title: "Platform & Developer Experience Engineering",
    subtitle: "Build the infrastructure other engineers rely on — fully language-agnostic",
    desc: "Internal developer platforms, CI/CD infrastructure, observability stacks, Kubernetes operators, service meshes. This is where 'language-agnostic' fully applies — you manage systems, not code. The Platform Engineer is one of the fastest-growing roles. Study Kubernetes internals, Terraform, Helm, Backstage, DORA metrics.",
    resources: [
      { name: "Kubernetes official docs", url: "https://kubernetes.io/docs/home/" },
      { name: "HashiCorp Learn (Terraform)", url: "https://developer.hashicorp.com/terraform/tutorials" },
      { name: "CNCF Landscape", url: "https://landscape.cncf.io" },
      { name: "Backstage.io (dev portals)", url: "https://backstage.io" },
    ],
    timeline: "Build after Month 4, serious specialization Year 2"
  },
  {
    icon: "🎯", color: "coral", title: "Technical Product Management",
    subtitle: "Move from building features to defining what gets built",
    desc: "Your cross-domain Intellect experience (frontend/backend/SQL/deploy/docs/support) is perfect prep. Learn: writing PRDs, user story mapping, stakeholder management, roadmapping, data-driven decisions. You'll be rare: a PM who deeply understands the technical constraints AND the user problem. 2–3 year horizon after strong engineering foundation.",
    resources: [
      { name: "'Inspired' by Marty Cagan (book)", url: "https://www.amazon.in/INSPIRED-Create-Tech-Products-Customers/dp/1119387507" },
      { name: "Lenny's Newsletter", url: "https://www.lennysnewsletter.com" },
      { name: "Shreyas Doshi on LinkedIn", url: "https://www.linkedin.com/in/shreyasdoshi/" },
      { name: "'The Mom Test' (book)", url: "https://www.momtestbook.com" },
    ],
    timeline: "Read 'Inspired' now. Transition Year 2–3"
  },
  {
    icon: "🔗", color: "blue", title: "AI Orchestration & Agentic Systems",
    subtitle: "The newest engineering discipline — very few experts, massive opportunity",
    desc: "Design multi-step AI workflows, autonomous agents, and orchestration pipelines. Not the AI model — the system that coordinates them. Learn: Agentic patterns (ReAct, Chain-of-Thought, Tool-use), multi-agent coordination (CrewAI, AutoGen), evaluation and safety frameworks. This specialization barely existed 2 years ago — early movers will define it.",
    resources: [
      { name: "Anthropic prompt engineering docs", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview" },
      { name: "OpenAI cookbook (GitHub)", url: "https://github.com/openai/openai-cookbook" },
      { name: "LangGraph docs", url: "https://langchain-ai.github.io/langgraph/" },
      { name: "CrewAI docs", url: "https://docs.crewai.com" },
    ],
    timeline: "Experiment Month 5, specialize after Month 6"
  },
];

const FIRMS = [
  { tier: 1, name: "Microsoft (MSFT)", location: "HITEC City", stack: "Azure, .NET/Java, cloud-native", salary: "₹30–55 LPA", wlb: 5, note: "Strong WLB culture, excellent ESOP", url: "https://careers.microsoft.com/v2/global/en/india.html" },
  { tier: 1, name: "Google", location: "Gachibowli", stack: "Go, Python, Java, GCP scale", salary: "₹35–70 LPA", wlb: 5, note: "Highest pay, competitive process", url: "https://www.google.com/about/careers/applications/jobs/results/?location=Hyderabad%2C%20Telangana%2C%20India" },
  { tier: 1, name: "Salesforce", location: "HITEC City", stack: "Java-heavy, enterprise SaaS", salary: "₹25–45 LPA", wlb: 4, note: "Excellent WLB reputation, great benefits", url: "https://careers.salesforce.com/en/jobs/?search=hyderabad&team=engineering" },
  { tier: 1, name: "Amazon (AWS)", location: "Gachibowli", stack: "Java, distributed systems", salary: "₹30–50 LPA", wlb: 3, note: "WLB varies by team — probe in interviews", url: "https://www.amazon.jobs/en/locations/hyderabad-india" },
  { tier: 2, name: "Qualcomm", location: "Gachibowli", stack: "Embedded + Cloud, C++/Java", salary: "₹20–40 LPA", wlb: 5, note: "Outstanding WLB, exceptional stability", url: "https://careers.qualcomm.com/careers/search?location=Hyderabad" },
  { tier: 2, name: "PayPal", location: "HITEC City", stack: "Java, Spring, fintech APIs", salary: "₹22–38 LPA", wlb: 4, note: "Java-heavy — perfect for your background", url: "https://careers.pypl.com/jobs/search?location=Hyderabad" },
  { tier: 2, name: "Persistent Systems", location: "Gachibowli", stack: "Java, microservices", salary: "₹14–25 LPA", wlb: 4, note: "Great for support→developer transition", url: "https://careers.persistent.com/jobs/" },
  { tier: 3, name: "Darwinbox", location: "HITEC City", stack: "Java, React, HR-tech unicorn", salary: "₹18–35 LPA + ESOP", wlb: 3, note: "High growth, meaningful equity", url: "https://darwinbox.com/careers" },
];

function WLBStars({ count }) {
  return (
    <span style={{ letterSpacing: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= count ? "#c47a0a" : "#ddd", fontSize: 13 }}>★</span>
      ))}
    </span>
  );
}

function ProgressBar({ pct, color }) {
  const colors = { blue: C.blue, teal: C.teal, amber: C.amber, purple: C.purple, coral: C.coral, green: C.green };
  return (
    <div style={{ background: "#e8edf3", borderRadius: 99, height: 5, margin: "8px 0 16px", overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: colors[color] || C.blue, borderRadius: 99, transition: "width 0.5s" }} />
    </div>
  );
}

function Tag({ color, children }) {
  return <span style={{ ...TAG_STYLES[color], fontSize: 11, padding: "3px 10px", borderRadius: 99, fontWeight: 500 }}>{children}</span>;
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10, ...style }}>
      {children}
    </div>
  );
}

function ResourceCard({ r }) {
  return (
    <div style={{ background: C.grayBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{r.type}</div>
      {r.url ? (
        <a href={r.url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 13, fontWeight: 600, color: C.blue, textDecoration: "none", display: "block", marginBottom: 2 }}>
          {r.name} ↗
        </a>
      ) : (
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{r.name}</div>
      )}
      <div style={{ fontSize: 12, color: C.muted }}>{r.desc}</div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", color: C.muted, textTransform: "uppercase", margin: "16px 0 8px" }}>{children}</div>;
}

function QAItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div onClick={() => setOpen(!open)} style={{ background: open ? "#f0f4ff" : C.grayBg, border: `1px solid ${open ? "#c0cff5" : C.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8, cursor: "pointer", transition: "all 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.text, flex: 1 }}>{q}</div>
        <div style={{ fontSize: 16, color: C.muted, flexShrink: 0, marginTop: -1 }}>{open ? "▲" : "▼"}</div>
      </div>
      {open && (
        <div style={{ fontSize: 13, color: C.muted, marginTop: 10, paddingTop: 10, borderTop: `1px solid #c0cff5`, lineHeight: 1.7 }}>{a}</div>
      )}
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item, i) => {
        const isObj = typeof item === "object";
        const text = isObj ? item.text : item;
        const links = isObj ? item.links : null;
        return (
          <li key={i} style={{ padding: "6px 0", borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: C.blue, fontWeight: 700, fontSize: 12, marginTop: 3, flexShrink: 0 }}>{"→"}</span>
              <span style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{text}</span>
            </div>
            {links && links.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 5, marginLeft: 22 }}>
                {links.map((lk, j) => (
                  <a key={j} href={lk.url} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11, color: C.blue, background: C.blueSoft, padding: "2px 9px", borderRadius: 99, textDecoration: "none", fontWeight: 500, border: "1px solid #c5d9f5" }}>
                    {lk.name} {"↗"}
                  </a>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function MonthDetail({ month }) {
  const [activeWeek, setActiveWeek] = useState(0);
  const weekData = month.weeks[activeWeek];

  return (
    <div>
      <div style={{ marginBottom: 4 }}>
        <Tag color={month.color}>{month.tag}</Tag>
      </div>
      <h2 style={{ fontSize: 17, fontWeight: 600, color: C.text, margin: "8px 0 4px" }}>{month.title}</h2>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>{month.subtitle}</p>
      <ProgressBar pct={month.progress} color={month.color} />

      {/* Week tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {month.weeks.map((w, i) => (
          <button key={i} onClick={() => setActiveWeek(i)} style={{
            padding: "6px 12px", borderRadius: 8, border: `1px solid ${activeWeek === i ? C.blue : C.border}`,
            background: activeWeek === i ? C.blueSoft : "transparent",
            color: activeWeek === i ? C.blue : C.muted, fontSize: 12, fontWeight: activeWeek === i ? 600 : 400, cursor: "pointer"
          }}>{w.label}</button>
        ))}
      </div>

      {/* Week content */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>{weekData.title}</div>
        <BulletList items={weekData.items} />
      </Card>

      {/* Cheat Sheet */}
      <SectionLabel>Monthly Cheat Sheet — Stick this to your wall</SectionLabel>
      <Card style={{ borderLeft: `4px solid ${C.blue}`, background: "#f8faff" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {month.cheatsheet.map((item, i) => (
            <li key={i} style={{ fontSize: 12.5, color: C.muted, padding: "4px 0", borderBottom: i < month.cheatsheet.length - 1 ? `1px solid #e8edf3` : "none", lineHeight: 1.6 }}>
              <span style={{ color: C.blue, marginRight: 6, fontWeight: 700 }}>✦</span>{item}
            </li>
          ))}
        </ul>
      </Card>

      {/* Resources */}
      <SectionLabel>Best Resources</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {month.resources.map((r, i) => <ResourceCard key={i} r={r} />)}
      </div>

      {/* Q&A */}
      <SectionLabel>Q&A Self-Test Bank — Click to reveal answers</SectionLabel>
      {month.qa.map((qa, i) => <QAItem key={i} q={qa.q} a={qa.a} />)}
    </div>
  );
}

function MonthsSection() {
  const [activeMonth, setActiveMonth] = useState(0);
  const colors = ["blue","teal","amber","purple","coral","green"];

  return (
    <div>
      {/* Month selector grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {MONTHS.map((m, i) => (
          <div key={i} onClick={() => setActiveMonth(i)} style={{
            background: activeMonth === i ? C.blueSoft : C.white,
            border: `1.5px solid ${activeMonth === i ? C.blue : C.border}`,
            borderRadius: 12, padding: "12px 14px", cursor: "pointer", transition: "all 0.15s"
          }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>Month {m.num}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: activeMonth === i ? C.blue : C.text, lineHeight: 1.4, marginBottom: 6 }}>{m.title}</div>
            <Tag color={colors[i]}>{m.tag}</Tag>
          </div>
        ))}
      </div>

      {/* Active month detail */}
      <Card>
        <MonthDetail month={MONTHS[activeMonth]} />
      </Card>
    </div>
  );
}

function FutureSection() {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <Card style={{ borderLeft: `4px solid ${C.teal}`, background: C.tealSoft, marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 6 }}>What "One Layer Above Coding" means</div>
        <p style={{ fontSize: 13, color: "#1a4a3a", lineHeight: 1.7 }}>AI handles syntax, boilerplate, and standard patterns. Your value becomes: architecture judgment, trade-off analysis, domain expertise, system orchestration, and problem framing. These cannot be prompted away.</p>
      </Card>

      <SectionLabel>Five Tracks to Pursue</SectionLabel>
      {FUTURE_TRACKS.map((t, i) => (
        <Card key={i} style={{ cursor: "pointer" }} >
          <div onClick={() => setOpen(open === i ? null : i)} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t.title}</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>{t.subtitle}</div>
            </div>
            <span style={{ color: C.muted, fontSize: 14, marginLeft: 8, flexShrink: 0 }}>{open === i ? "▲" : "▼"}</span>
          </div>
          {open === i && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 10 }}>{t.desc}</p>
              <div style={{ background: C.grayBg, borderRadius: 8, padding: "8px 12px", marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginBottom: 6 }}>BEST RESOURCES</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {t.resources.map((r, ri) => (
                    <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12.5, color: C.blue, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 10 }}>↗</span> {r.name}
                    </a>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.teal, fontWeight: 500 }}>⏱ {t.timeline}</div>
            </div>
          )}
        </Card>
      ))}

      <SectionLabel>Daily "One Layer Above" Habit (30 min/day)</SectionLabel>
      <Card>
        <BulletList items={[
          "Monday: Read one architecture blog (martinfowler.com, Netflix Tech Blog, Uber Engineering, Atlassian Engineering)",
          "Wednesday: Watch one conference talk (InfoQ, GOTO Conference, Strange Loop — all free on YouTube)",
          "Friday: Hands-on experiment — one AI-integrated feature, Terraform tutorial step, or k8s exercise",
          "Sunday: Write 200 words in Notion about what you learned this week — this becomes your thinking portfolio",
        ]} />
      </Card>
    </div>
  );
}

function FirmCard({ f }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{f.name}</div>
        <WLBStars count={f.wlb} />
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>📍 {f.location} · {f.stack}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.green }}>{f.salary}</span>
        {f.url && (
          <a href={f.url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 12, color: C.blue, textDecoration: "none", background: C.blueSoft, padding: "3px 10px", borderRadius: 6, fontWeight: 500 }}>
            View Careers ↗
          </a>
        )}
      </div>
      <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{f.note}</div>
    </Card>
  );
}

function FirmsSection() {
  return (
    <div>
      <Card style={{ background: C.grayBg }}>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>The Holy Trinity: excellent WLB + competitive salary (comfortable life in Gachibowli/HITEC City) + modern tech stack. Rated below with that lens.</p>
      </Card>

      <SectionLabel>Tier 1 — Top Pay + Best WLB</SectionLabel>
      {FIRMS.filter(f => f.tier === 1).map((f, i) => <FirmCard key={i} f={f} />)}

      <SectionLabel>Tier 2 — Great WLB, Strong Pay, More Realistic Entry</SectionLabel>
      {FIRMS.filter(f => f.tier === 2).map((f, i) => <FirmCard key={i} f={f} />)}

      <SectionLabel>Tier 3 — High Growth / Startups</SectionLabel>
      {FIRMS.filter(f => f.tier === 3).map((f, i) => <FirmCard key={i} f={f} />)}
    </div>
  );
}

function StrategySection() {
  return (
    <div>
      <SectionLabel>Application Timing — Don't Rush This</SectionLabel>
      <Card>
        <BulletList items={[
          "Month 1–3: Don't apply. Focus 100% on learning. Exception: referral opportunity → take it for practice",
          "Month 4: Update LinkedIn. Apply to 2–3 'practice' companies you're indifferent about. Get interview reps",
          "Month 5: Apply to Tier 3 targets. Real interviews, real feedback. Adjust prep based on gaps found",
          "Month 6: Apply to ALL Tier 1 & 2 targets simultaneously. You want 5+ processes running for competing offers",
        ]} />
      </Card>

      <SectionLabel>Referral Strategy (2× faster than cold apply)</SectionLabel>
      <Card style={{ borderLeft: `4px solid ${C.teal}` }}>
        <BulletList items={[
          "Search LinkedIn: your college alumni at target companies in Hyderabad — message them personally",
          "Message template: 'Hi [Name], I'm a fellow [college] alumnus at Intellect. I noticed you're at [Company] — I'd love to hear about your experience. Would you be open to a 15-min chat?' Never ask for referral upfront",
          "After a good call: 'If you feel it's appropriate, I'd appreciate a referral for the SDE-2 role'",
          "Join: GDG Hyderabad meetups, HTAP (Hyderabad Tech & Startup), Java user groups — be a regular face",
          "GitHub activity: green squares matter. Commit daily, even if small — recruiters look at this",
        ]} />
      </Card>

      <SectionLabel>WLB Evaluation Checklist — Ask in Every Interview</SectionLabel>
      <Card>
        <BulletList items={[
          "'What does a typical work week look like for engineers on this team?'",
          "'How often do engineers get paged or handle incidents outside business hours?'",
          "'Does the team generally work weekends around product launches?'",
          "'How does the team allocate time for technical debt and refactoring?'",
          "Check Glassdoor reviews filtered to last 12 months, specifically reading 'Work-Life Balance' section",
          "Ask to speak with a future peer (not just the hiring manager) during the interview process",
          "Red flag phrases: 'we work hard, play hard', 'like a family', 'always available' — probe these",
        ]} />
      </Card>

      <SectionLabel>Salary Negotiation Script</SectionLabel>
      <Card style={{ background: C.grayBg }}>
        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
          <p style={{ marginBottom: 8 }}><strong>Never accept the first offer.</strong> Always say:</p>
          <p style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontStyle: "italic", color: C.blue, marginBottom: 8 }}>
            "I'm very excited about this opportunity and the team. Based on my research on market rates for SDE-2 roles in Hyderabad and the value I'd bring, I was expecting something closer to [X+20%]. Is there flexibility on the base or the total package?"
          </p>
          <p style={{ fontSize: 12, color: C.muted }}>Target: ₹20–28 LPA base at product companies. ₹30+ with competing offers and strong negotiation at top firms.</p>
        </div>
      </Card>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "months", label: "Monthly Plan" },
    { id: "future", label: "Future Tech" },
    { id: "firms", label: "Firms" },
    { id: "strategy", label: "Strategy" },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f3f5f8", minHeight: "100vh", padding: "0 0 40px" }}>
      {/* Header */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "18px 16px 14px" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 4, fontFamily: "Georgia, serif" }}>
          Hyderabad Tech Career Roadmap
        </h1>
        <p style={{ fontSize: 12, color: C.muted }}>Production Support → SDE-2 at a WLB-friendly firm · 6 months</p>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 4, marginTop: 14, overflowX: "auto", paddingBottom: 2 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "7px 13px", borderRadius: 8, border: `1px solid ${activeTab === t.id ? C.blue : C.border}`,
              background: activeTab === t.id ? C.blue : "transparent",
              color: activeTab === t.id ? C.white : C.muted, fontSize: 12, fontWeight: activeTab === t.id ? 600 : 400,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "14px 12px" }}>
        {activeTab === "overview" && (
          <div>
            <Card style={{ borderLeft: `4px solid ${C.blue}`, background: "#f0f5ff" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.blue, marginBottom: 6 }}>Your Starting Advantage</div>
              <p style={{ fontSize: 13, color: "#1a3a6a", lineHeight: 1.7 }}>Your production support background — seeing real failures, debugging live systems, working across frontend/backend/SQL/deploy — is a genuine edge over fresh graduates. This plan turns that into a developer role.</p>
            </Card>

            <SectionLabel>The 6-Month Arc</SectionLabel>
            {[
              { months: "Month 1–2", title: "Foundations", desc: "Java depth, DSA basics, SQL mastery, Git & Linux fluency", color: C.blue },
              { months: "Month 3–4", title: "Build Skills", desc: "Spring Boot, REST APIs, System Design, Cloud fundamentals", color: C.amber },
              { months: "Month 5", title: "Ship Something Real", desc: "Full-stack project, AI tooling, deployed portfolio piece", color: C.coral },
              { months: "Month 6", title: "Get The Offer", desc: "Interview sprint, 20+ applications, negotiate confidently", color: C.green },
              { months: "All 6 months", title: "One Layer Above", desc: "Architecture thinking, AI engineering, future-proofing daily habit", color: C.teal },
            ].map((row, i) => (
              <Card key={i}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: row.color, flexShrink: 0, marginTop: 5 }} />
                  <div>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{row.months}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>{row.title}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>{row.desc}</div>
                  </div>
                </div>
              </Card>
            ))}

            <SectionLabel>Realistic Daily Time Budget</SectionLabel>
            <Card>
              <BulletList items={[
                "Weekdays: 2.5 hours after work (6:30–9pm) — 45min DSA / 45min concept / 45min build / 15min review",
                "Saturday: 4 hours — deep learning block + project work",
                "Sunday: 3 hours — revision + mock interview + next-week planning",
                "Total: ~22 hours/week. Consistency beats intensity — never miss two days in a row",
              ]} />
            </Card>
          </div>
        )}

        {activeTab === "months" && <MonthsSection />}
        {activeTab === "future" && <FutureSection />}
        {activeTab === "firms" && <FirmsSection />}
        {activeTab === "strategy" && <StrategySection />}
      </div>
    </div>
  );
}
