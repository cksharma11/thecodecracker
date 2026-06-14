export const systemDesignQuestions = [
  {
    id: 1,
    title: "Design a URL Shortener (e.g., TinyURL)",
    category: "Web Applications",
    difficulty: "Easy",
    summary: "A service to convert long URLs into short, unique aliases, redirecting users upon access.",
    requirements: {
      functional: [
        "Generate a unique short alias for a given long URL.",
        "Redirect users visiting the short URL to the original long URL.",
        "Support custom aliases (e.g., tinyurl.com/myAlias)."
      ],
      nonFunctional: [
        "High availability (99.99% redirection uptime).",
        "Redirection latency under 50ms.",
        "Short links should be random and non-guessable."
      ]
    },
    estimations: "100M URLs generated per month. Read/Write ratio: 100:1. Write QPS: ~40. Read QPS: ~4000. Storage (5 years): 6 billion URLs * 500 bytes = 3TB.",
    apis: [
      { method: "POST", path: "/api/v1/urls", desc: "Shorten a URL", request: "{ \"longUrl\": \"string\", \"customAlias\": \"string?\" }", response: "{ \"shortUrl\": \"string\" }" },
      { method: "GET", path: "/{shortKey}", desc: "Redirect to target URL", request: "None", response: "302 Redirect Location Header" }
    ],
    dataModel: {
      type: "NoSQL Key-Value Store (Cassandra or DynamoDB)",
      schema: "URLMap Table:\n- shortKey (varchar, PK)\n- originalUrl (varchar)\n- userId (varchar, index)\n- createdAt (timestamp)"
    },
    highLevelFlow: [
      { from: "Client", to: "Load Balancer", label: "HTTPS Redirect Requests" },
      { from: "Load Balancer", to: "App Servers", label: "Distribute Traffic" },
      { from: "App Servers", to: "Redis Cache", label: "Lookup shortKey" },
      { from: "App Servers", to: "Database", label: "Fallback DB query on Cache Miss" }
    ],
    deepDive: "Uses base-62 encoding (a-z, A-Z, 0-9) to compress 64-bit auto-incrementing integers (from a distributed unique ID generator) into 7-character aliases. Redis LRU cache absorbs 95%+ of redirection traffic, caching hot redirects to maintain sub-50ms latencies.",
    tradeoffs: "Cassandra is preferred over SQL for simple key-value lookups due to linear scaling and masterless architecture. Eventual consistency is accepted for custom alias analytics."
  },
  {
    id: 2,
    title: "Design a Rate Limiter",
    category: "Infrastructure",
    difficulty: "Medium",
    summary: "A security service to throttle incoming traffic to web applications to prevent DDoS attacks and API abuse.",
    requirements: {
      functional: [
        "Limit requests per user/IP/endpoint based on predefined rates.",
        "Return standard 429 Too Many Requests status with retry headers when limits are breached."
      ],
      nonFunctional: [
        "Extremely low latency footprint (< 3ms overhead per request).",
        "Must be highly accurate across multiple distributed API servers.",
        "Fault tolerance: Limiters must fallback gracefully if the rating cluster goes offline."
      ]
    },
    estimations: "10B daily requests. QPS: ~120,000. Peak QPS: ~250,000. Storage is negligible (simple sliding window user request count keys).",
    apis: [
      { method: "Middleware", path: "Intercepts all requests", desc: "Verifies token limits", request: "Headers (Client IP / API Key)", response: "429 Limit Exceeded or 200 Proceed" }
    ],
    dataModel: {
      type: "In-Memory Store (Redis)",
      schema: "RateLimit Hash:\n- key: String (e.g. rate:ip:192.168.1.1)\n- value: Number (token count or timestamp list)\n- TTL: Expiry set to window size"
    },
    highLevelFlow: [
      { from: "Client", to: "API Gateway", label: "HTTP Request" },
      { from: "API Gateway", to: "Rate Limiter", label: "Validate Limits" },
      { from: "Rate Limiter", to: "Redis Cluster", label: "Atomic Token Check" },
      { from: "API Gateway", to: "Backend Servers", label: "Allowed: Forward Request" }
    ],
    deepDive: "Uses Token Bucket or Sliding Window Log algorithms. Redis commands (Lua scripts) are executed atomically to prevent race conditions during concurrent limit validations. Fallback is set to 'fail-open' if Redis is down, preserving system availability over strict limiting.",
    tradeoffs: "Sliding Window Log is highly accurate but memory-intensive. Token Bucket is memory-efficient but permits occasional spikes. Token Bucket is chosen for scale."
  },
  {
    id: 3,
    title: "Design a Web Crawler",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A system that traverses the web, index pages, extracts hyperlinks, and downloads documents for search engines.",
    requirements: {
      functional: [
        "Extract HTML content from seed URLs.",
        "Discover new hyperlinks and queue them for future crawling.",
        "Save extracted textual contents to a storage index."
      ],
      nonFunctional: [
        "Scalability (handle billions of pages).",
        "Politeness: Avoid overloading target web servers (implement delay limits).",
        "Robustness: Detect traps (infinite loops), duplicates, and spam links."
      ]
    },
    estimations: "15 billion web pages crawled monthly. Crawl rate: ~5,800 pages/second. Storage: 15B pages * 100KB = 1.5PB/month.",
    apis: [
      { method: "Internal Worker", path: "Batch Processing", desc: "Pulls URLs from queue, fetches contents, and parses anchors", request: "Seed URLs list", response: "Parsed pages & links" }
    ],
    dataModel: {
      type: "Distributed File System (HDFS) & Key-Value DB (HBase)",
      schema: "CrawledPages:\n- urlHash (varchar, PK)\n- rawHtml (blob)\n- parsedText (text)\n- crawlTime (timestamp)"
    },
    highLevelFlow: [
      { from: "URL Frontier", to: "Crawler Workers", label: "Fetch Next URLs" },
      { from: "Crawler Workers", to: "DNS Resolver", label: "Lookup Domain IP" },
      { from: "Crawler Workers", to: "Target Site", label: "GET HTTP Page" },
      { from: "Crawler Workers", to: "HDFS Storage", label: "Persist HTML Content" }
    ],
    deepDive: "Uses a URL Frontier component with FIFO queues grouped by domain name to enforce politeness delays. Employs HTML parsing engines to extract anchors. Detects duplicated content via SimHash values of the parsed texts, discarding redundant page crawling.",
    tradeoffs: "Breadth-First Search (BFS) is preferred over Depth-First Search (DFS) to crawl diverse domains rather than digging infinitely down a single website's sub-links."
  },
  {
    id: 4,
    title: "Design a Notification System",
    category: "Web Applications",
    difficulty: "Medium",
    summary: "A highly scalable multi-channel messaging platform delivering SMS, email, and mobile push notifications.",
    requirements: {
      functional: [
        "Deliver notifications across Email, SMS, and Mobile Push (iOS/Android).",
        "Provide template engines for personalization."
      ],
      nonFunctional: [
        "Real-time delivery (< 10s for time-sensitive notifications).",
        "Reliability: Guaranteed delivery (retries with exponential backoff).",
        "Deduplication: Prevent duplicate messages from being sent to the same user."
      ]
    },
    estimations: "10 million users. 50 million notifications/day. Average QPS: ~600 notifications/sec. Peak QPS: ~3,000/sec.",
    apis: [
      { method: "POST", path: "/api/v1/notify", desc: "Trigger notification", request: "{ \"userId\": \"string\", \"type\": \"EMAIL|SMS|PUSH\", \"templateId\": \"string\", \"variables\": {} }", response: "{ \"notificationId\": \"string\", \"status\": \"QUEUED\" }" }
    ],
    dataModel: {
      type: "Relational DB (PostgreSQL) for transactional data + Key-Value (Redis) for templates",
      schema: "NotificationLog:\n- id (uuid, PK)\n- userId (uuid)\n- channel (varchar)\n- status (enum)\n- retryCount (int)\n- createdAt (timestamp)"
    },
    highLevelFlow: [
      { from: "App Server", to: "Notification API", label: "Trigger Send" },
      { from: "Notification API", to: "Message Queue", label: "Enqueue Notification Task" },
      { from: "Workers", to: "Third-party Provider", label: "Dispatch (APNS, Twilio, SendGrid)" },
      { from: "Workers", to: "Database", label: "Log Delivery Status" }
    ],
    deepDive: "Integrates standard queues (RabbitMQ/Kafka) to decouple clients from slow 3rd-party network providers. Implements user preferences settings. Tracks message uniqueness via hash tokens generated from key parameters, enforcing a 5-minute deduplication window.",
    tradeoffs: "Decoupling components via queues increases architectural complexity but is essential to absorb load spikes and handle provider outages."
  },
  {
    id: 5,
    title: "Design WhatsApp / Messenger (Real-Time Chat)",
    category: "Real-Time / Geo",
    difficulty: "Hard",
    summary: "A messaging app supporting instant 1-on-1 and group chats, status signals, and media transfers.",
    requirements: {
      functional: [
        "Real-time 1-on-1 and group chat delivery.",
        "Online/offline status indicators (presence service).",
        "Read receipts (sent, delivered, read)."
      ],
      nonFunctional: [
        "Extremely low latency (message delivery < 150ms).",
        "High reliability: Zero message drops (messages persist when offline).",
        "End-to-end encryption for security."
      ]
    },
    estimations: "500 million active users. 10 billion messages daily. QPS: ~115,000. Storage: 10B messages * 100 bytes = 1TB per day.",
    apis: [
      { method: "WebSocket", path: "/ws/chat", desc: "Duplex channel for messages", request: "WebSocket Handshake", response: "Real-time stream" }
    ],
    dataModel: {
      type: "Wide-Column Key-Value DB (Cassandra or ScyllaDB)",
      schema: "Messages Table:\n- messageId (uuid, PK)\n- channelId (varchar)\n- senderId (varchar)\n- content (text)\n- status (enum)\n- timestamp (timestamp, Clustering Key)"
    },
    highLevelFlow: [
      { from: "Sender", to: "WebSocket Server", label: "Send Message payload" },
      { from: "WebSocket Server", to: "Presence Service", label: "Check Receiver Status" },
      { from: "WebSocket Server", to: "Receiver", label: "Online: Forward Message" },
      { from: "WebSocket Server", to: "HBase DB", label: "Offline: Queue to Persistent Storage" }
    ],
    deepDive: "Maintains active WebSocket connections. Employs a distributed Presence Service using Redis hashes (storing heartbeats sent by active clients every 30 seconds). Group chats are broadcasted via fan-out workers that scale horizontally.",
    tradeoffs: "Cassandra is picked over standard SQL because it scales writes linearly, which is ideal for a system writing trillions of messages yearly."
  },
  {
    id: 6,
    title: "Design a News Feed System (e.g., Twitter / Facebook)",
    category: "Web Applications",
    difficulty: "Hard",
    summary: "A scalable engine that compiles and delivers posts from friends, pages, and followed accounts chronologically.",
    requirements: {
      functional: [
        "Generate a timeline of posts for a user from followed accounts.",
        "Allow users to create posts containing text, images, or video.",
        "Support paginated loading of feed items."
      ],
      nonFunctional: [
        "Rapid post retrieval (< 200ms).",
        "Scalable feed generation (handling celebrity posts with millions of followers).",
        "High availability (reads must not fail)."
      ]
    },
    estimations: "100M active users. Followers/user: ~200. Celebrity followers: ~10M+. Post QPS: ~5,000. Feed load QPS: ~50,000.",
    apis: [
      { method: "GET", path: "/api/v1/feed", desc: "Retrieve news feed", request: "Query Params (page, size)", response: "{ \"posts\": [] }" },
      { method: "POST", path: "/api/v1/posts", desc: "Publish a post", request: "{ \"text\": \"string\", \"mediaUrls\": [] }", response: "{ \"postId\": \"string\" }" }
    ],
    dataModel: {
      type: "Relational DB (PostgreSQL) + Redis Cache Clusters",
      schema: "Post:\n- id (uuid, PK)\n- userId (uuid)\n- text (varchar)\n- createdAt (timestamp)\n\nFollow:\n- followerId (uuid)\n- followeeId (uuid)"
    },
    highLevelFlow: [
      { from: "User", to: "App Server", label: "Create Post" },
      { from: "App Server", to: "Fan-out Service", label: "Queue for Followers" },
      { from: "Fan-out Service", to: "Redis User Feeds", label: "Push Post ID to follower lists" },
      { from: "Follower", to: "App Server", label: "Fetch Feed (loads from Redis)" }
    ],
    deepDive: "Employs two feed generation models: Push (fan-out on write) and Pull (fan-out on read). Active users use pre-computed feeds stored in Redis (Push model). High-volume celebrity accounts (e.g., millions of followers) are handled via the Pull model: their posts are fetched on-demand when followers refresh feeds, preventing write bottlenecks.",
    tradeoffs: "Using a hybrid model increases system complexity but avoids system crash during high fan-out tasks (e.g., when a celebrity posts a status)."
  },
  {
    id: 7,
    title: "Design YouTube or Netflix (Video Streaming)",
    category: "Web Applications",
    difficulty: "Hard",
    summary: "A platform hosting video contents, supporting uploads, transcodes, searches, and seamless worldwide playbacks.",
    requirements: {
      functional: [
        "Allow video uploads, metadata inputs, and search capabilities.",
        "Stream videos dynamically at various resolutions (adaptive bitrate streaming).",
        "Track user watch history and progress."
      ],
      nonFunctional: [
        "Sub-second playback startup times.",
        "Zero video stuttering or buffering.",
        "Scale storage to accommodate massive uploads."
      ]
    },
    estimations: "200M active users. 50M uploads/month. 1 video = 100MB average. Storage needed: 5PB per month. Streaming bandwidth: ~300 Tbps.",
    apis: [
      { method: "POST", path: "/api/v1/videos/upload", desc: "Upload raw video", request: "Multipart Form Data", response: "{ \"uploadId\": \"string\" }" },
      { method: "GET", path: "/api/v1/videos/{videoId}/stream", desc: "Get stream manifest URL", request: "None", response: "{ \"manifestUrl\": \"string\" }" }
    ],
    dataModel: {
      type: "Object Storage (Amazon S3) + Metadata DB (PostgreSQL) + search index",
      schema: "VideoMetadata:\n- id (uuid, PK)\n- title (varchar)\n- description (text)\n- s3Url (varchar)\n- status (enum)\n- createdAt (timestamp)"
    },
    highLevelFlow: [
      { from: "Uploader", to: "App Server", label: "Upload Video" },
      { from: "App Server", to: "Object Storage (S3)", label: "Store Raw file" },
      { from: "Transcoder Service", to: "Object Storage (S3)", label: "Transcode to multiple formats" },
      { from: "Viewer", to: "CDN (Edge Server)", label: "Stream Manifest file segments" }
    ],
    deepDive: "Video files are split into small chunks (2-10 seconds). Transcoders encode these chunks into multiple formats (HLS/DASH) and bitrates (1080p, 720p, 480p). Files are pushed to Content Delivery Networks (CDNs) worldwide. Adaptive Bitrate Streaming allows the player to dynamically swap quality based on user internet speeds.",
    tradeoffs: "Heavy transcoding is compute-intensive but essential. It shifts the heavy lifting to write-time to ensure seamless, low-bandwidth reads."
  },
  {
    id: 8,
    title: "Design Search Autocomplete (Trie-based)",
    category: "Real-Time / Geo",
    difficulty: "Medium",
    summary: "A query service returning the top 5 trending search suggestions as a user types into a search box.",
    requirements: {
      functional: [
        "Return top 5 matching queries based on user prefix.",
        "Update suggestions dynamically as trending query counts change."
      ],
      nonFunctional: [
        "Extremely fast response times (< 10ms response latency).",
        "Highly available: System failures must not block typing input.",
        "Scale to handle 100,000+ searches/second."
      ]
    },
    estimations: "100k queries/sec. Query size: ~15 characters. Daily queries: ~8.6B. Cache must store millions of common prefixes.",
    apis: [
      { method: "GET", path: "/api/v1/autocomplete", desc: "Fetch prefix suggestions", request: "Query Params (prefix: string)", response: "{ \"suggestions\": [\"string\"] }" }
    ],
    dataModel: {
      type: "Trie data structure serialized in Redis + Document Index for backups",
      schema: "Trie Node:\n- char: String\n- isWord: Boolean\n- frequency: Integer\n- topSuggestions: Array (caching precomputed results)"
    },
    highLevelFlow: [
      { from: "Client", to: "Load Balancer", label: "Type Prefix (e.g., 'sys')" },
      { from: "Load Balancer", to: "Autocomplete Server", label: "FetchSuggestions" },
      { from: "Autocomplete Server", to: "Redis Trie Cache", label: "Scan Trie Node" },
      { from: "Data Collector", to: "Trie DB Store", label: "Aggregated Offline update of word counts" }
    ],
    deepDive: "Uses a Trie (prefix tree) structure. Traversing a Trie at runtime to collect leaves and sort by frequency is too slow. To maintain O(1) time complexity, each Trie Node pre-computes and caches its top 5 suggestions. Prefix maps are updated in batches offline using MapReduce pipelines.",
    tradeoffs: "Caching suggestions on every node increases memory usage by 4-5x but is necessary to hit the 10ms real-time typing deadline."
  },
  {
    id: 9,
    title: "Design a Unique ID Generator (e.g., Snowflake)",
    category: "Distributed Systems",
    difficulty: "Easy",
    summary: "A highly available service to generate unique 64-bit IDs across multiple distributed servers without central coordination.",
    requirements: {
      functional: [
        "Generate globally unique identifiers.",
        "IDs must be roughly sortable chronologically."
      ],
      nonFunctional: [
        "Extremely high throughput (> 10,000 IDs/sec per machine).",
        "Redundant and highly available (no single point of failure).",
        "Redirection/generation latency under 1ms."
      ]
    },
    estimations: "10,000 IDs per second. 864M IDs/day. 64-bit integer size for compact storage (8 bytes/ID).",
    apis: [
      { method: "GET", path: "/api/v1/ids", desc: "Retrieve unique ID", request: "None", response: "{ \"id\": \"int64\" }" }
    ],
    dataModel: {
      type: "Memory-based bit manipulation (Snowflake layout)",
      schema: "64-bit ID Layout:\n- 1 bit: Unused\n- 41 bits: Epoch Milliseconds\n- 10 bits: Machine/Worker ID\n- 12 bits: Sequence Number (resets to 0 every millisecond)"
    },
    highLevelFlow: [
      { from: "Client", to: "App Server", label: "Fetch ID" },
      { from: "App Server", to: "Snowflake Generator", label: "Generate Bitmask ID" },
      { from: "ZooKeeper", to: "Snowflake Generator", label: "Assign Machine IDs on startup" }
    ],
    deepDive: "Uses Twitter's Snowflake algorithm. The 41-bit timestamp portion allows for 69 years of ID generation. The 10-bit machine identifier supports up to 1,024 worker nodes. The 12-bit sequence permits 4,096 unique IDs per millisecond per machine. ZooKeeper coordinates node starts to ensure no machines share identical IDs.",
    tradeoffs: "Relies on synchronized system clocks (NTP). If a machine's clock drifts backward, the system blocks ID generation to avoid duplicates."
  },
  {
    id: 10,
    title: "Design a Distributed Message Queue (e.g., Kafka)",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A distributed, high-throughput, partitioned commit log service for publishing and subscribing to event streams.",
    requirements: {
      functional: [
        "Publish events to named topics.",
        "Allow consumers to subscribe to topics and read messages sequentially.",
        "Guarantee order of messages at the partition level."
      ],
      nonFunctional: [
        "Extremely high write/read throughput.",
        "Durability: Messages are persisted on disk and replicated.",
        "Scalable: Easily add partitions and brokers dynamically."
      ]
    },
    estimations: "1 million messages/sec. Message size: 1KB. Write bandwidth: 1GB/sec. Daily storage: 1GB/s * 86,400s = ~86TB.",
    apis: [
      { method: "POST", path: "/api/v1/publish", desc: "Send event to topic", request: "{ \"topic\": \"string\", \"key\": \"string\", \"value\": \"blob\" }", response: "{ \"offset\": \"int64\" }" }
    ],
    dataModel: {
      type: "Append-only Disk Log files",
      schema: "Topic Partition Directory:\n- 0000000000.log (raw messages)\n- 0000000000.index (offsets mapped to physical disk locations)"
    },
    highLevelFlow: [
      { from: "Producer", to: "Broker (Partition Leader)", label: "Append Message to log" },
      { from: "Broker (Leader)", to: "Follower Brokers", label: "Replicate Log segments" },
      { from: "Consumer Group", to: "Broker (Leader)", label: "Fetch logs from last offset position" }
    ],
    deepDive: "Avoids memory indices. Writes to disk sequentially (append-only log), which is extremely fast. Uses OS page caches and the 'Zero-Copy' network transfer (transferring data directly from kernel space page cache to network socket without copying it into user space) to optimize throughput. Replicates data across brokers using an In-Sync Replicas (ISR) model.",
    tradeoffs: "Sacrifices global ordering across an entire topic to gain high horizontal scalability; ordering is guaranteed only within a single partition."
  },
  {
    id: 11,
    title: "Design a Distributed Key-Value Store",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A globally distributed, partition-tolerant key-value store with tunable consistency.",
    requirements: {
      functional: [
        "Store data via put(key, value) and retrieve via get(key).",
        "Scale dynamically by adding database nodes."
      ],
      nonFunctional: [
        "High write availability (dynamo-style eventual consistency).",
        "Fault tolerance: Survive data center network partitions.",
        "Configurable consistency parameters (tunable R, W, N)."
      ]
    },
    estimations: "1B read/write operations daily. QPS: ~12,000. Low latency lookup target (< 10ms). Data size: 10TB+.",
    apis: [
      { method: "PUT", path: "/store/{key}", desc: "Insert/Update key value", request: "Blob data", response: "200 OK" },
      { method: "GET", path: "/store/{key}", desc: "Retrieve key value", request: "None", response: "Blob data" }
    ],
    dataModel: {
      type: "LSM-Tree on disk (SSTables) + MemTable in memory",
      schema: "Key-Value mapping with versioning metadata:\n- key: string\n- value: blob\n- version: vectorClock"
    },
    highLevelFlow: [
      { from: "Client", to: "Coordinator Node", label: "PUT /key" },
      { from: "Coordinator Node", to: "Hash Ring (Consistent Hashing)", label: "Find N Replica Nodes" },
      { from: "Coordinator Node", to: "Replica Nodes", label: "Write payload in parallel" }
    ],
    deepDive: "Uses Consistent Hashing to distribute keys across a node ring. Employs Vector Clocks to detect and reconcile write conflicts. Implements Sloppy Quorums and Hinted Handoffs to allow writes to succeed even when partition members are offline. Gossip Protocols maintain cluster member status.",
    tradeoffs: "Relies on Eventual Consistency and read-time conflict resolution to guarantee write availability under network partitions (consistent with the CAP theorem)."
  },
  {
    id: 12,
    title: "Design a Distributed Cache (e.g., Redis Cluster)",
    category: "Infrastructure",
    difficulty: "Medium",
    summary: "A high-performance in-memory cache system replicated and partitioned across a cluster of servers.",
    requirements: {
      functional: [
        "Provide in-memory key-value operations with TTL support.",
        "Automatically evict expired keys using LRU policies."
      ],
      nonFunctional: [
        "Sub-millisecond latencies for standard lookups.",
        "Automatic partition redistribution on server crashes."
      ]
    },
    estimations: "Write QPS: ~50,000. Read QPS: ~500,000. Memory Capacity: 10TB RAM across a cluster of 50 machines.",
    apis: [
      { method: "SET", path: "/cache/{key}", desc: "Write cached value with optional TTL", request: "value, ttl", response: "OK" },
      { method: "GET", path: "/cache/{key}", desc: "Read cached value", request: "None", response: "Cached string data" }
    ],
    dataModel: {
      type: "In-memory Hash Table with doubly linked list (LRU eviction track)",
      schema: "Memory Bucket:\n- key: String\n- val: Pointer\n- expiryTime: Long"
    },
    highLevelFlow: [
      { from: "Client", to: "Client Cache Router", label: "Locate target node using hash slot" },
      { from: "Client Cache Router", to: "Target Cache Node", label: "Read/Write in memory" },
      { from: "Cache Node (Master)", to: "Cache Node (Replica)", label: "Replicate asynchronous updates" }
    ],
    deepDive: "Partitions data using 16,384 logical Hash Slots. Master nodes handle writes and stream replication asynchronously to slave nodes. Implements an LRU eviction strategy: when memory is exhausted, the oldest, least active keys are freed to make room.",
    tradeoffs: "Data replication to replica nodes is asynchronous. If a master node crashes before replication completes, some write updates may be lost."
  },
  {
    id: 13,
    title: "Design a Distributed File System (e.g., GFS)",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A system designed to store large files reliably across thousands of commodity hardware nodes.",
    requirements: {
      functional: [
        "Support files of multi-GB/TB sizes.",
        "Provide standard read, append, and write operations."
      ],
      nonFunctional: [
        "High bandwidth throughput (reads in parallel).",
        "Fault tolerance: Data must survive node failures.",
        "Detect and heal silent data corruption."
      ]
    },
    estimations: "Storage capacity: 100PB+. Thousands of servers. Files are typically 1GB to 100GB in size.",
    apis: [
      { method: "System call", path: "/open /read /append", desc: "Read and write large file streams", request: "FilePath, offset, buffer", response: "Buffer data" }
    ],
    dataModel: {
      type: "Flat hierarchical files catalog mapped to distributed chunk locations",
      schema: "Metadata Map (stored in Master node RAM):\n- filename -> List of chunk IDs\n- chunk ID -> List of physical chunkserver IP addresses"
    },
    highLevelFlow: [
      { from: "Client", to: "Master Node", label: "Query: Who has chunk #4 of file.mp4?" },
      { from: "Master Node", to: "Client", label: "Return Chunk Server IPs & location offsets" },
      { from: "Client", to: "Chunk Server", label: "Stream data chunks directly" }
    ],
    deepDive: "Large files are split into fixed 64MB chunks. A single master node manages metadata, while chunkservers store actual chunks. The client queries the master node once for locations and then streams data directly from chunkservers to prevent bottlenecking the master.",
    tradeoffs: "The single master node simplifies metadata consistency but must keep all metadata in memory to prevent slow disk bottlenecks."
  },
  {
    id: 14,
    title: "Design E-Commerce Checkout (e.g., Amazon)",
    category: "Web Applications",
    difficulty: "Medium",
    summary: "A shopping cart and payment checkout funnel that manages order creation, inventory reservations, and payment processing.",
    requirements: {
      functional: [
        "Add, view, and modify items in a shopping cart.",
        "Perform safe transactional checkouts, reserving inventory and charging cards."
      ],
      nonFunctional: [
        "Highly consistent: Never double-sell inventory.",
        "Fast response times for adding to cart (< 50ms).",
        "Idempotency: Guaranteed zero double-charges on payment retries."
      ]
    },
    estimations: "Daily Orders: 2 million. Peak Order QPS: ~500. Read QPS: ~20,000.",
    apis: [
      { method: "POST", path: "/api/v1/checkout", desc: "Submit payment & process order", request: "{ \"cartId\": \"string\", \"paymentToken\": \"string\" }", response: "{ \"orderId\": \"string\", \"status\": \"SUCCESS\" }" }
    ],
    dataModel: {
      type: "ACID Compliant Relational DB (MySQL or Oracle) + Distributed transactions tracker",
      schema: "Inventory:\n- productId (PK)\n- stockCount (int)\nOrder:\n- orderId (PK)\n- userId (uuid)\n- totalAmount (decimal)\n- paymentStatus (enum)"
    },
    highLevelFlow: [
      { from: "Client", to: "Checkout Service", label: "POST /checkout" },
      { from: "Checkout Service", to: "Inventory Service", label: "Reserve Stock (DB Row Lock)" },
      { from: "Checkout Service", to: "Payment Gateway (Stripe)", label: "Process Charge using Idempotency Key" },
      { from: "Checkout Service", to: "Order DB", label: "Finalize and commit Order" }
    ],
    deepDive: "Uses database transaction locks (`SELECT FOR UPDATE`) to block race conditions during stock updates. Generates an Idempotency Key (sent by the client) to prevent duplicate transactions if network timeouts cause users to click the pay button multiple times.",
    tradeoffs: "Uses strict relational databases for checkout to ensure transactions comply with ACID properties, accepting slower database performance compared to NoSQL."
  },
  {
    id: 15,
    title: "Design a Ride-Sharing Service (e.g., Uber / Lyft)",
    category: "Real-Time / Geo",
    difficulty: "Hard",
    summary: "A real-time ride matcher, tracking driver locations and pairing them with nearby passenger requests.",
    requirements: {
      functional: [
        "Track real-time driver locations.",
        "Match users requesting rides with the closest available drivers.",
        "Provide live updates of the driver's route during pickup."
      ],
      nonFunctional: [
        "Extremely low matching latency (< 2s).",
        "Scalable location tracking (updating positions every 4 seconds).",
        "High availability for passenger matches."
      ]
    },
    estimations: "10 million active drivers. Positions updated every 4s. Location updates QPS: ~2.5 million. Ride request QPS: ~2,000.",
    apis: [
      { method: "POST", path: "/api/v1/rides/request", desc: "Request a ride", request: "{ \"passengerId\": \"uuid\", \"pickup\": \"[lat,lng]\", \"drop\": \"[lat,lng]\" }", response: "{ \"rideId\": \"uuid\", \"status\": \"SEARCHING\" }" },
      { method: "WS", path: "/ws/driver/location", desc: "WebSocket to update driver coordinates", request: "Coordinates tuple", response: "Acknowledge" }
    ],
    dataModel: {
      type: "Geospatial Index (Redis Geospatial + PostgreSQL PostGIS)",
      schema: "ActiveDrivers Table:\n- driverId (PK)\n- location (geography)\n- isAvailable (boolean)\n- lastUpdated (timestamp)"
    },
    highLevelFlow: [
      { from: "Driver App", to: "Location Service", label: "WS: Stream GPS Coordinates every 4s" },
      { from: "Location Service", to: "Geohash Cache (Redis)", label: "Store driver cell locations" },
      { from: "Passenger App", to: "Matching Engine", label: "Request Ride" },
      { from: "Matching Engine", to: "Geohash Cache (Redis)", label: "Query nearest drivers inside local cell" }
    ],
    deepDive: "Divides the physical map into regions using index systems (Google's S2 library or Geohash). Locations are held in memory using Redis Geospatial commands (`GEORADIUS`). Matches are calculated by scanning surrounding Geohash cells, filtering out drivers who are already busy.",
    tradeoffs: "Driver location updates bypass disk persistence, saving location history in memory to handle the high throughput of coordinate updates."
  },
  {
    id: 16,
    title: "Design Collaborative Editor (Google Docs)",
    category: "Real-Time / Geo",
    difficulty: "Hard",
    summary: "A real-time text editor allowing thousands of users to modify the same document concurrently.",
    requirements: {
      functional: [
        "Support multi-user concurrent document editing.",
        "Show real-time updates from other active users (< 100ms lag).",
        "Track user cursor positions."
      ],
      nonFunctional: [
        "High consistency: All users must see the same document state eventually.",
        "Fault tolerance: Prevent document state corruption on network loss."
      ]
    },
    estimations: "10 million active documents. 50 million edits daily. Write QPS: ~5,000. Real-time broadcast volume: ~100k events/sec.",
    apis: [
      { method: "WS", path: "/ws/document/{docId}", desc: "WebSocket for real-time edit operations stream", request: "WebSocket Handshake", response: "Edit operations" }
    ],
    dataModel: {
      type: "NoSQL DB (Cassandra) + Memory cache for operational sequence logs",
      schema: "EditOperation:\n- docId (PK)\n- userId (uuid)\n- opType (INSERT|DELETE)\n- character (char)\n- position (int)\n- sequenceNumber (int)"
    },
    highLevelFlow: [
      { from: "Client A", to: "Collab Server", label: "WS: Send Edit Operation (Insert 'X' at pos 5)" },
      { from: "Collab Server", to: "OT/CRDT Engine", label: "Resolve conflict & update base doc" },
      { from: "Collab Server", to: "Active Clients", label: "Broadcast transformed operations" },
      { from: "Collab Server", to: "Database", label: "Asynchronous save to document log" }
    ],
    deepDive: "Uses Conflict-free Replicated Data Types (CRDTs) or Operational Transformation (OT) to resolve edit conflicts. The server assigns sequence numbers to all incoming edits. When conflicts arise, the server calculates offset adjustments (e.g. if two users insert characters at the same position simultaneously) and broadcasts the corrected actions to all active browsers.",
    tradeoffs: "OT requires a centralized server to coordinate operation sequences, while CRDT is decentralized but uses significantly more memory and bandwidth."
  },
  {
    id: 17,
    title: "Design Search Indexer (e.g., Google Search)",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A search indexer processing petabytes of crawled text to build high-performance inverted indexes.",
    requirements: {
      functional: [
        "Ingest crawled web documents.",
        "Tokenize text, remove stop words, and build an inverted index.",
        "Rank documents based on term frequency and quality metrics (PageRank)."
      ],
      nonFunctional: [
        "High scalability (indexing billions of pages).",
        "Low index update latency (discoveries appear in search quickly)."
      ]
    },
    estimations: "10B documents. Inverted index storage: ~500TB. Processing throughput: 50,000 pages per second.",
    apis: [
      { method: "Internal Pipeline", path: "Batch Processing", desc: "MapReduce jobs to clean HTML and update indexes", request: "Raw S3 files", response: "Inverted Index shards" }
    ],
    dataModel: {
      type: "NoSQL Wide-Column DB (HBase) + Inverted Index files",
      schema: "Inverted Index Map:\n- word (String, PK)\n- postingsList: Array of { docId, termFrequency, positions }"
    },
    highLevelFlow: [
      { from: "Crawl Storage", to: "HTML Parser", label: "Extract raw text & links" },
      { from: "HTML Parser", to: "MapReduce Cluster", label: "Map: Emit (Word, DocID)" },
      { from: "MapReduce Cluster", to: "Inverted Index", label: "Reduce: Sort & build Postings Lists" },
      { from: "Search API", to: "Inverted Index", label: "Query lookups" }
    ],
    deepDive: "Tokenizes text, strips HTML tags, and converts words to their base forms (stemming). The MapReduce pipeline converts document lists into an Inverted Index (a mapping of words to the documents they appear in). Shards index files by document ID to distribute search queries evenly.",
    tradeoffs: "Batch indexing simplifies calculations but delays the appearance of new web content in search results compared to real-time indexing."
  },
  {
    id: 18,
    title: "Design Ticketmaster (Ticket Booking)",
    category: "Web Applications",
    difficulty: "Medium",
    summary: "A high-performance transaction system that reserves and sells concert tickets, preventing double-bookings during high-demand events.",
    requirements: {
      functional: [
        "Display available concert seats in real-time.",
        "Allow users to reserve a seat for 10 minutes during checkout.",
        "Process payments to finalize ticket purchases."
      ],
      nonFunctional: [
        "Strict consistency: Never sell the same seat to two users.",
        "High read throughput (millions of users checking seat maps simultaneously).",
        "Resilient against sudden traffic spikes when popular concert tickets go on sale."
      ]
    },
    estimations: "10M concurrent users during popular sales. 50,000 seat stadium. Peak booking QPS: ~5,000. Read QPS: ~500,000.",
    apis: [
      { method: "POST", path: "/api/v1/bookings/reserve", desc: "Temporarily reserve seat", request: "{ \"showId\": \"string\", \"seatId\": \"string\" }", response: "{ \"reservationId\": \"string\", \"expiresAt\": \"timestamp\" }" },
      { method: "POST", path: "/api/v1/bookings/confirm", desc: "Purchase ticket", request: "{ \"reservationId\": \"string\", \"paymentToken\": \"string\" }", response: "{ \"ticketId\": \"string\", \"status\": \"CONFIRMED\" }" }
    ],
    dataModel: {
      type: "ACID Relational DB (PostgreSQL) + Redis Cache for seat availability status",
      schema: "SeatReservation:\n- id (uuid, PK)\n- showId (uuid)\n- seatId (varchar)\n- userId (uuid)\n- status (RESERVED|SOLD)\n- expiresAt (timestamp)"
    },
    highLevelFlow: [
      { from: "Client", to: "Booking Service", label: "POST /reserve" },
      { from: "Booking Service", to: "Redis Cache", label: "Acquire Distributed Lock (seatId)" },
      { from: "Booking Service", to: "Database", label: "Insert Reservation (expires in 10m)" },
      { from: "Booking Service", to: "Payment Service", label: "Charge customer credit card" }
    ],
    deepDive: "Uses distributed locks in Redis (Redlock) to prevent concurrent seat reservation requests. Relational database transactions with strict isolation levels (`SERIALIZABLE`) guarantee that only one booking succeeds, while unsuccessful attempts fail quickly. Active reservations expire automatically after 10 minutes via cron workers if the checkout is not completed.",
    tradeoffs: "Locking seats in memory provides fast responses to users, but increases system complexity to prevent locks from getting stuck due to network timeouts."
  },
  {
    id: 19,
    title: "Design Stripe (Payment Gateway)",
    category: "Web Applications",
    difficulty: "Medium",
    summary: "A reliable API service connecting merchants with banking networks to process credit card payments securely.",
    requirements: {
      functional: [
        "Process credit card payments securely.",
        "Support payment updates and refunds.",
        "Provide transaction logs for merchant audits."
      ],
      nonFunctional: [
        "Extremely reliable: Zero transaction failures or data loss.",
        "Security: Compliant with PCI-DSS standards.",
        "Strict Idempotency: Prevent double charges on API retries."
      ]
    },
    estimations: "100 million transactions daily. QPS: ~1,200. Storage: 100M transactions * 1KB = 100GB/day. Needs 100% database replication.",
    apis: [
      { method: "POST", path: "/v1/charges", desc: "Charge credit card", request: "{ \"amount\": 1000, \"currency\": \"usd\", \"source\": \"tok_card\", \"idempotency_key\": \"string\" }", response: "{ \"id\": \"ch_123\", \"status\": \"succeeded\" }" }
    ],
    dataModel: {
      type: "ACID Relational DB (PostgreSQL or MySQL with multi-region cluster)",
      schema: "Charge:\n- id (varchar, PK)\n- amount (int)\n- currency (varchar)\n- status (varchar)\n- idempotencyKey (varchar, Unique)\n- createdAt (timestamp)"
    },
    highLevelFlow: [
      { from: "Merchant App", to: "Payment API Gateway", label: "POST /charges (with token & Idempotency Key)" },
      { from: "Payment API Gateway", to: "Core Payment Service", label: "Lookup Idempotency Key" },
      { from: "Core Payment Service", to: "Acquiring Bank API", label: "Process Card Transaction" },
      { from: "Core Payment Service", to: "Transaction Database", label: "Log details & return response" }
    ],
    deepDive: "Checks for client-provided idempotency keys at the API gateway: if a key already exists in the database, the gateway returns the cached response instead of processing a new charge. The system uses secure tokenization to handle card data without exposing sensitive numbers to merchant servers.",
    tradeoffs: "Using strict relational database locks is slower than NoSQL stores but is required to prevent financial transaction errors."
  },
  {
    id: 20,
    title: "Design Instagram (Photo Sharing)",
    category: "Web Applications",
    difficulty: "Medium",
    summary: "A social platform for uploading images, building user feeds, and supporting likes and comments.",
    requirements: {
      functional: [
        "Allow users to upload photos and add captions.",
        "Allow users to follow other accounts and view a timeline feed.",
        "Support post likes and comments."
      ],
      nonFunctional: [
        "Fast image loading (< 200ms latency).",
        "High availability: Feeds must remain accessible.",
        "Scalable storage: Handle petabytes of media uploads."
      ]
    },
    estimations: "500 million active users. 50 million photo uploads daily. Image size: 2MB. Daily media storage: 100TB.",
    apis: [
      { method: "POST", path: "/api/v1/posts", desc: "Create a photo post", request: "Multipart Form Data (image, caption)", response: "{ \"postId\": \"string\", \"url\": \"string\" }" }
    ],
    dataModel: {
      type: "Object Storage (Amazon S3) + Relational DB (PostgreSQL sharded) + Redis Cache",
      schema: "Posts Table:\n- postId (uuid, PK)\n- userId (uuid)\n- imageUrl (varchar)\n- caption (text)\n- createdAt (timestamp)"
    },
    highLevelFlow: [
      { from: "Client", to: "Upload API", label: "Upload image file" },
      { from: "Upload API", to: "Object Storage (S3)", label: "Store raw file" },
      { from: "Upload API", to: "Image Processing Worker", label: "Create thumbnails & optimize sizes" },
      { from: "Upload API", to: "Metadata DB", label: "Save file reference and path" }
    ],
    deepDive: "Saves raw photos to object stores (Amazon S3) and distributes them globally via Content Delivery Networks (CDNs). The database is sharded by `userId` to spread write loads. Feeds are stored in memory using Redis clusters to avoid slow database joins on page loads.",
    tradeoffs: "Images are compressed at upload time, losing some raw quality to reduce storage costs and network load on mobile connections."
  },
  {
    id: 21,
    title: "Design a Content Delivery Network (CDN)",
    category: "Infrastructure",
    difficulty: "Hard",
    summary: "A network of edge servers distributed globally to cache and serve static contents close to users.",
    requirements: {
      functional: [
        "Cache static contents (images, videos, JS, CSS) from origin servers.",
        "Route users dynamically to the nearest edge server."
      ],
      nonFunctional: [
        "Lowest possible content delivery latency (< 20ms).",
        "High throughput: Serve petabytes of traffic concurrently.",
        "High availability: Automatically bypass failed edge nodes."
      ]
    },
    estimations: "Global traffic: ~100 Tbps. Cache hit ratio target: 95%+. Storage space per edge server: ~100TB.",
    apis: [
      { method: "GET", path: "/static/{fileId}", desc: "Fetch cached asset", request: "None", response: "File payload" }
    ],
    dataModel: {
      type: "Edge Node Local SSD File Storage + Cache Mapping in RAM",
      schema: "CacheManifest:\n- assetPathHash (String, PK)\n- fileLocationOnDisk (String)\n- ttlExpiry (Long)\n- headerMetadata (JSON)"
    },
    highLevelFlow: [
      { from: "Client", to: "DNS Name Server", label: "Resolve cdn.app.com" },
      { from: "DNS Name Server", to: "Client", label: "Return closest Edge Node IP via Anycast Routing" },
      { from: "Client", to: "Edge Server", label: "Request static file" },
      { from: "Edge Server", to: "Origin Server", label: "Cache Miss: Fetch from Origin" }
    ],
    deepDive: "Uses Anycast DNS Routing to send user requests to the closest physical point of presence (PoP). Edge servers run caching systems (Nginx or Varnish) and store hot files on fast SSDs. Active cache invalidation protocols notify edge servers when content updates at the origin.",
    tradeoffs: "Consistent cache invalidation is difficult; clients must accept delayed content updates (eventual consistency) based on TTL durations."
  },
  {
    id: 22,
    title: "Design Metrics Monitoring (e.g., Prometheus)",
    category: "Infrastructure",
    difficulty: "Medium",
    summary: "A metrics monitoring service that collects system statistics, stores time-series data, and triggers alerts.",
    requirements: {
      functional: [
        "Collect metrics (CPU usage, memory, QPS, error rates) from servers.",
        "Support querying metrics over dynamic time intervals.",
        "Trigger alerts when custom thresholds are crossed."
      ],
      nonFunctional: [
        "High write availability: Metrics collection must not block target servers.",
        "Scalable: Handle millions of data points per second.",
        "Low query latency for dashboards."
      ]
    },
    estimations: "10,000 servers. Each server registers 100 metrics every 10s. Write throughput: 100,000 metrics/sec. Storage: ~1.5TB per day.",
    apis: [
      { method: "POST", path: "/api/v1/metrics", desc: "Push metrics (Pushgateway model)", request: "Time-series format", response: "OK" },
      { method: "GET", path: "/api/v1/query", desc: "Query metrics data", request: "Metrics expression", response: "Time-series values" }
    ],
    dataModel: {
      type: "Time-Series Database (TSDB - e.g. InfluxDB or Prometheus TSDB)",
      schema: "Time-Series Record:\n- metricName (varchar)\n- tags (JSON key-value)\n- timestamp (int64, PK)\n- value (double)"
    },
    highLevelFlow: [
      { from: "Monitored Host", to: "Monitoring Agent", label: "Expose metrics page" },
      { from: "Monitoring Server", to: "Monitored Host", label: "Pull metrics (Scrape) every 10s" },
      { from: "Monitoring Server", to: "TSDB Engine", label: "Save time-series points" },
      { from: "Alert Manager", to: "Slack / PagerDuty", label: "Trigger alarm if threshold exceeded" }
    ],
    deepDive: "Uses a Pull Model: the monitoring server scrapes metrics endpoints exposed by client applications, preventing client applications from being blocked by logging failures. Time-series data is written sequentially to disk in compressed chunks (using Gorilla compression), reducing memory usage by up to 10x.",
    tradeoffs: "A pull-based system simplifies service metrics collection but requires target services to expose reachable HTTP status endpoints."
  },
  {
    id: 23,
    title: "Design Nearby Places Locator (Yelp / Google Maps)",
    category: "Real-Time / Geo",
    difficulty: "Medium",
    summary: "A local search service allowing users to search for restaurants or shops within a set radius of their location.",
    requirements: {
      functional: [
        "Allow businesses to register profiles with coordinates.",
        "Search for nearby businesses within a set distance (e.g. 2 miles)."
      ],
      nonFunctional: [
        "Low latency search results (< 100ms).",
        "Support high read volume.",
        "Highly accurate location matching."
      ]
    },
    estimations: "50 million businesses. 100,000 search queries/sec. Storage is small (~100 bytes per business, 5GB total).",
    apis: [
      { method: "GET", path: "/api/v1/search", desc: "Find nearby businesses", request: "Query Params (lat, lng, radius)", response: "{ \"businesses\": [] }" }
    ],
    dataModel: {
      type: "Geospatial Index (PostgreSQL PostGIS or Redis Geospatial)",
      schema: "Business:\n- id (uuid, PK)\n- name (varchar)\n- location (POINT, Spatial Index)\n- address (varchar)"
    },
    highLevelFlow: [
      { from: "Client", to: "API Gateway", label: "GET /search?lat=37.7&lng=-122.4" },
      { from: "API Gateway", to: "Search Service", label: "Lookup restaurants" },
      { from: "Search Service", to: "Geohash Index Cache", label: "Find businesses in local Geohash cells" },
      { from: "Search Service", to: "Database", label: "Fallback for missing metadata" }
    ],
    deepDive: "Divides the map into grid cells using Geohashes. A 6-character Geohash covers an area of roughly 1.2 square kilometers. When a user searches, the system calculates their Geohash, queries businesses stored under that Geohash, and includes the 8 adjacent cells to return accurate border results.",
    tradeoffs: "Geohash grids are static. Densely populated areas (like cities) contain many more data points than rural areas, requiring different resolution levels."
  },
  {
    id: 24,
    title: "Design Ad Click Aggregation System",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A real-time data pipeline that aggregates ad clicks to track ad performance and charge advertisers accurately.",
    requirements: {
      functional: [
        "Ingest high-volume ad click events.",
        "Aggregate clicks by ad ID in 1-minute intervals.",
        "Export aggregated metrics for billing and dashboards."
      ],
      nonFunctional: [
        "Highly accurate: Never undercount or double-count clicks (exactly-once processing).",
        "Real-time processing latency (< 1 minute delay)."
      ]
    },
    estimations: "1 billion clicks per day. QPS: ~12,000. Peak QPS: ~50,000. Aggregated data size: ~1GB/day.",
    apis: [
      { method: "POST", path: "/api/v1/clicks", desc: "Log ad click", request: "{ \"adId\": \"string\", \"userId\": \"string\", \"timestamp\": \"long\" }", response: "202 Accepted" }
    ],
    dataModel: {
      type: "Distributed Stream Processor (Apache Flink/Spark) + Time-Series DB",
      schema: "AdAnalytics:\n- adId (varchar, PK)\n- windowStart (timestamp, PK)\n- clickCount (int)\n- totalRevenue (decimal)"
    },
    highLevelFlow: [
      { from: "User Client", to: "API Ingestor", label: "Click Ad link" },
      { from: "API Ingestor", to: "Message Queue (Kafka)", label: "Buffer Raw Click Events" },
      { from: "Stream Processor", to: "Message Queue (Kafka)", label: "Consume & window aggregate" },
      { from: "Stream Processor", to: "Database", label: "Upsert 1-minute totals" }
    ],
    deepDive: "Uses message queues (Kafka) to buffer traffic spikes. A stream processing framework (Apache Flink) runs sliding-window aggregations. To achieve exactly-once processing, the system uses idempotent database writes and deduplicates events using a unique `clickId` hash.",
    tradeoffs: "Guaranteeing exactly-once processing increases system latency and requires keeping deduplication caches in memory."
  },
  {
    id: 25,
    title: "Design Distributed Lock Manager (ZooKeeper)",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A coordination service that manages resource locks across distributed server clusters.",
    requirements: {
      functional: [
        "Allow servers to acquire exclusive locks on named resources.",
        "Release locks automatically if a server crashes."
      ],
      nonFunctional: [
        "Strict consistency: A lock must never be held by two servers simultaneously.",
        "High availability: The locking cluster must survive server outages."
      ]
    },
    estimations: "Lock requests QPS: ~5,000. System size is small; locking states are stored entirely in memory.",
    apis: [
      { method: "TCP call", path: "/lock/acquire", desc: "Acquire lock", request: "resourceKey, timeout", response: "Success or Fail" },
      { method: "TCP call", path: "/lock/release", desc: "Release lock", request: "resourceKey, lockToken", response: "OK" }
    ],
    dataModel: {
      type: "Hierarchical memory tree with consensus protocol (Raft/ZAB)",
      schema: "Node Schema:\n- path: string (e.g. /locks/resource_1)\n- ownerSessionId: string\n- version: integer"
    },
    highLevelFlow: [
      { from: "App Server", to: "Lock Coordinator", label: "Create Ephemeral Node '/locks/res_1'" },
      { from: "Lock Coordinator", to: "Consensus Cluster", label: "Replicate lock state to majority" },
      { from: "Lock Coordinator", to: "App Server", label: "Confirm Lock Acquisition" }
    ],
    deepDive: "Uses consensus protocols (Raft or ZooKeeper's ZAB) to replicate lock states. Clients open persistent TCP sessions: if a client crashes, its session times out, and the coordinator automatically deletes its ephemeral lock nodes to prevent deadlocks.",
    tradeoffs: "Prioritizes consistency (CP in CAP): if a network partition occurs, the locking cluster blocks updates until a leader majority is re-established."
  },
  {
    id: 26,
    title: "Design WebSockets Gateway at Scale",
    category: "Infrastructure",
    difficulty: "Hard",
    summary: "A gateway service that manages millions of persistent WebSocket connections to enable real-time messaging.",
    requirements: {
      functional: [
        "Manage persistent WebSocket connections from clients.",
        "Allow backend microservices to push messages to specific clients."
      ],
      nonFunctional: [
        "Highly scalable (support 5 million concurrent connections).",
        "Minimize connection drop rates.",
        "Low memory usage per connection (< 10KB)."
      ]
    },
    estimations: "5M concurrent connections. If 1 connection takes 10KB RAM, total gateway memory required: 50GB RAM.",
    apis: [
      { method: "WS", path: "/connect", desc: "Establish WebSocket connection", request: "Upgrade Header", response: "Persistent Connection" }
    ],
    dataModel: {
      type: "In-memory Routing Table + Redis Pub/Sub",
      schema: "UserRouting Hash:\n- userId: String\n- gatewayIpAddress: String (IP hosting the WebSocket)"
    },
    highLevelFlow: [
      { from: "Client", to: "WebSocket Gateway Node", label: "Establish WS TCP connection" },
      { from: "Gateway Node", to: "Routing Registry (Redis)", label: "Map User ID -> Gateway IP" },
      { from: "Backend Service", to: "Redis Pub/Sub", label: "Publish: Send message to User" },
      { from: "Gateway Node", to: "Client", label: "Push message over active WS connection" }
    ],
    deepDive: "Uses asynchronous network I/O libraries (Netty or Go Netpoll) to manage thousands of open TCP connections per server. A Redis lookup registry maps `userId` to the specific gateway IP address holding their connection. When a message is sent, the gateway receives it via Redis Pub/Sub and pushes it to the client.",
    tradeoffs: "Frequent client reconnections can overload the Redis registry with write updates, requiring connection rate-limiting."
  },
  {
    id: 27,
    title: "Design a Stock Brokerage (e.g., Robinhood)",
    category: "Web Applications",
    difficulty: "Hard",
    summary: "A financial brokerage system that tracks stock prices, manages user accounts, and routes orders to stock exchanges.",
    requirements: {
      functional: [
        "Display real-time stock price tickers.",
        "Allow users to submit buy/sell stock orders (Market/Limit orders).",
        "Track user account balances and portfolios."
      ],
      nonFunctional: [
        "Strict transaction consistency: Zero account balance errors.",
        "Low latency order routing (< 50ms).",
        "High availability: The platform must remain operational during market opens."
      ]
    },
    estimations: "10M active users. Peak Order QPS: ~5,000. Price updates: 10,000 updates/sec. 100% database audit trails required.",
    apis: [
      { method: "POST", path: "/api/v1/orders", desc: "Submit stock order", request: "{ \"symbol\": \"AAPL\", \"action\": \"BUY\", \"quantity\": 10, \"type\": \"MARKET\" }", response: "{ \"orderId\": \"string\", \"status\": \"PENDING\" }" }
    ],
    dataModel: {
      type: "Double-Entry Ledger DB (SQL database with transactional tables)",
      schema: "Order:\n- id (uuid, PK)\n- userId (uuid)\n- symbol (varchar)\n- type (varchar)\n- status (varchar)\n- executionPrice (decimal)\n\nLedger:\n- id (PK)\n- accountId (uuid)\n- amount (decimal)\n- entryType (DEBIT|CREDIT)"
    },
    highLevelFlow: [
      { from: "Client", to: "Order Gateway", label: "POST /orders" },
      { from: "Order Gateway", to: "Risk Service", label: "Verify funds and balance" },
      { from: "Order Gateway", to: "Matching Engine", label: "Route order to market maker" },
      { from: "Matching Engine", to: "Ledger DB", label: "Commit order execution and update balances" }
    ],
    deepDive: "Uses double-entry bookkeeping: every financial transaction must have a matching debit and credit entry, preventing money from disappearing or being created. Stock price tickers stream to clients via WebSockets, while the matching engine executes trades in memory before persisting them to the database.",
    tradeoffs: "Using strict transactional databases guarantees compliance but increases system latency compared to NoSQL databases."
  },
  {
    id: 28,
    title: "Design Hotel Booking (e.g., Airbnb)",
    category: "Web Applications",
    difficulty: "Medium",
    summary: "A booking system that lists properties, manages availability calendars, and processes room reservations.",
    requirements: {
      functional: [
        "Allow hosts to list properties with calendar availability.",
        "Allow guests to search for properties by date range.",
        "Allow guests to book rooms for specific date ranges."
      ],
      nonFunctional: [
        "Strict consistency: Never double-book the same room for overlapping dates.",
        "Low latency listing searches (< 150ms)."
      ]
    },
    estimations: "100 million listings. 1 million bookings per day. Search QPS: ~10,000. Booking QPS: ~200.",
    apis: [
      { method: "GET", path: "/api/v1/listings/search", desc: "Search listings by availability", request: "checkIn, checkOut, location", response: "{ \"listings\": [] }" },
      { method: "POST", path: "/api/v1/bookings", desc: "Book a room", request: "{ \"listingId\": \"string\", \"checkIn\": \"date\", \"checkOut\": \"date\" }", response: "{ \"bookingId\": \"string\" }" }
    ],
    dataModel: {
      type: "Relational DB (PostgreSQL) for booking transactions + Elasticsearch for search",
      schema: "Availability:\n- listingId (PK)\n- date (date, PK)\n- isReserved (boolean)\n- price (decimal)"
    },
    highLevelFlow: [
      { from: "Guest Client", to: "Search Service", label: "GET /listings/search" },
      { from: "Search Service", to: "Elasticsearch", label: "Find matches by location and dates" },
      { from: "Guest Client", to: "Booking Service", label: "POST /bookings" },
      { from: "Booking Service", to: "Database", label: "Lock listing availability row & insert booking" }
    ],
    deepDive: "Maintains a daily availability table containing rows for each room and date. When a booking is requested, the system runs `SELECT FOR UPDATE` on the target dates: if any date is already reserved, the transaction aborts, preventing double-bookings.",
    tradeoffs: "Updating Elasticsearch indexes asynchronously after database changes is fast but can display briefly outdated availability in search results."
  },
  {
    id: 29,
    title: "Design a Distributed Database (e.g., Spanner)",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A globally distributed database that provides ACID transactions and SQL queries at global scale.",
    requirements: {
      functional: [
        "Execute distributed transactional SQL queries.",
        "Replicate data automatically across multiple data centers."
      ],
      nonFunctional: [
        "Strict consistency (external consistency/serializability) globally.",
        "High availability for reads and writes."
      ]
    },
    estimations: "Global scale. Millions of operations/sec. Multi-region deployments with sub-50ms transaction latency.",
    apis: [
      { method: "SQL query", path: "Database Engine", desc: "Execute ACID transactional SQL queries", request: "SQL script", response: "Result rows" }
    ],
    dataModel: {
      type: "LSM-Tree styled storage replicated via Paxos consensus",
      schema: "Relational tables sharded into 'Directories' based on key prefixes"
    },
    highLevelFlow: [
      { from: "Client", to: "Spanner Node", label: "Execute Write Transaction" },
      { from: "Spanner Node", to: "Paxos Group Leader", label: "Commit Transaction" },
      { from: "Paxos Leader", to: "TrueTime API", label: "Request Commit Timestamp" },
      { from: "Paxos Leader", to: "Follower Nodes", label: "Replicate transaction logs" }
    ],
    deepDive: "Uses synchronized hardware clocks (GPS receivers and atomic clocks) via Google's TrueTime API. This allows the database to assign monotonically increasing timestamps to all transactions globally, guaranteeing serializability without slow coordinator locks.",
    tradeoffs: "Relies on expensive, custom hardware (GPS and atomic clocks); running this architecture on standard cloud servers is difficult."
  },
  {
    id: 30,
    title: "Design Multiplayer Game Backend",
    category: "Real-Time / Geo",
    difficulty: "Hard",
    summary: "A low-latency game backend that manages player match lobbies, streams game states, and coordinates multi-player actions.",
    requirements: {
      functional: [
        "Match players into game lobbies based on skill ratings.",
        "Stream active game states to all players with low latency.",
        "Coordinate player actions and movements in real-time."
      ],
      nonFunctional: [
        "Ultra-low latency connection footprint (round-trip < 50ms).",
        "High update frequency (tick rate of 30-60 updates/sec).",
        "Prevent cheating by validating all player actions on the server."
      ]
    },
    estimations: "1 million concurrent players. Tick rate: 30Hz. Packet throughput: 30M packets/sec. Low-overhead network protocols required.",
    apis: [
      { method: "UDP/WS", path: "/game/stream", desc: "Real-time state streaming channel", request: "UDP datagrams", response: "State updates" }
    ],
    dataModel: {
      type: "In-memory state management (Redis) + transactional player profiles database",
      schema: "GameState (in-memory struct):\n- gameId: String\n- playersList: Map of { playerId, coords, velocity }\n- entitiesList: List of entities\n- tickNumber: Integer"
    },
    highLevelFlow: [
      { from: "Player Client", to: "Matchmaking Service", label: "Request match" },
      { from: "Matchmaking Service", to: "Game Server Instance", label: "Spin up lobby" },
      { from: "Player Client", to: "Game Server Instance", label: "Stream actions via UDP" },
      { from: "Game Server Instance", to: "Player Client", label: "Broadcast game state updates at 30Hz" }
    ],
    deepDive: "Uses UDP instead of TCP to avoid head-of-line blocking delays. The server acts as the source of truth, running game loops (ticks) to calculate player positions and collisions, and broadcasting state updates back to clients. Clients use interpolation to display smooth movements between updates.",
    tradeoffs: "UDP does not guarantee packet delivery. If packets are lost, the client must estimate positions, which can cause players to jitter on screen."
  },
  {
    id: 31,
    title: "Design Distributed Task Scheduler",
    category: "Distributed Systems",
    difficulty: "Medium",
    summary: "A scheduling service that runs billions of tasks at specific times or intervals across a cluster of servers.",
    requirements: {
      functional: [
        "Schedule tasks to run at a specific time (e.g. tomorrow at 3 PM) or repeatedly.",
        "Execute tasks reliably at scale."
      ],
      nonFunctional: [
        "High accuracy: Tasks should execute within 1 second of their scheduled time.",
        "Fault tolerance: Tasks must not be lost if a scheduler server crashes."
      ]
    },
    estimations: "100 million tasks scheduled daily. QPS: ~1,200. Peak QPS: ~10,000.",
    apis: [
      { method: "POST", path: "/api/v1/jobs", desc: "Schedule a task", request: "{ \"taskType\": \"string\", \"payload\": {}, \"scheduleTime\": \"timestamp\" }", response: "{ \"jobId\": \"string\" }" }
    ],
    dataModel: {
      type: "Distributed database (Cassandra) + Sorted memory queue (Redis Sorted Set)",
      schema: "ScheduledJob:\n- jobId (uuid, PK)\n- taskType (varchar)\n- payload (text)\n- scheduleTime (timestamp, index)\n- status (PENDING|RUNNING|FAILED)"
    },
    highLevelFlow: [
      { from: "Client App", to: "Scheduler API", label: "POST /jobs" },
      { from: "Scheduler API", to: "Database", label: "Save Job record" },
      { from: "Scheduler API", to: "Redis Sorted Set", label: "Push job ID scored by scheduleTime" },
      { from: "Scheduler Worker", to: "Redis Sorted Set", label: "Poll jobs where time <= current_time" }
    ],
    deepDive: "Saves tasks to a database and pushes them to a Redis Sorted Set scored by their execution timestamp. Polling workers query the top of the sorted set: if the scheduled time is reached, the worker locks the task, executes it, and updates its status in the database.",
    tradeoffs: "Workers poll the queue frequently, which can cause database lock contention under heavy loads, requiring dynamic polling backoffs."
  },
  {
    id: 32,
    title: "Design Log Aggregation (ELK Stack)",
    category: "Infrastructure",
    difficulty: "Medium",
    summary: "A central service that collects, indexes, and allows searching of application logs from thousands of servers.",
    requirements: {
      functional: [
        "Collect text logs from application servers.",
        "Index log entries to support rapid full-text search.",
        "Provide search filters for fields like severity, host, and time."
      ],
      nonFunctional: [
        "High write availability: Log ingestion must not block backend application nodes.",
        "Low search latency (queries return in < 500ms)."
      ]
    },
    estimations: "10,000 hosts. Average 100 logs/sec per host. Ingestion throughput: 1M logs/sec. Storage: 1M * 500 bytes = 500MB/sec = ~43TB/day.",
    apis: [
      { method: "POST", path: "/api/v1/logs/ingest", desc: "Ingest batch logs", request: "JSON array of log objects", response: "202 Accepted" }
    ],
    dataModel: {
      type: "Distributed Search Index (Elasticsearch/Lucene)",
      schema: "LogRecord:\n- id (uuid, PK)\n- timestamp (timestamp)\n- host (varchar)\n- message (text, indexed)\n- level (varchar)"
    },
    highLevelFlow: [
      { from: "App Server", to: "Log Shipper (Filebeat)", label: "Read local log files" },
      { from: "Log Shipper", to: "Log Broker (Kafka)", label: "Buffer logs to prevent data loss" },
      { from: "Log Processor (Logstash)", to: "Log Broker (Kafka)", label: "Consume, parse, and clean logs" },
      { from: "Log Processor", to: "Elasticsearch", label: "Index logs for search" }
    ],
    deepDive: "Uses log shippers (like Filebeat) to stream logs asynchronously to Kafka, protecting the indexing database from traffic spikes. Elasticsearch parses the logs and builds inverted indexes on textual fields to enable fast keyword queries.",
    tradeoffs: "Elasticsearch indexes data in real-time, which uses significant CPU and memory. Old log data must be moved to cheaper storage (like S3) to control costs."
  },
  {
    id: 33,
    title: "Design a Garbage Collection Engine",
    category: "Infrastructure",
    difficulty: "Hard",
    summary: "An automatic memory manager that tracks allocations and reclaims unused memory space.",
    requirements: {
      functional: [
        "Automatically allocate memory for objects on the heap.",
        "Identify and reclaim memory occupied by unreachable objects."
      ],
      nonFunctional: [
        "Minimize pause times (avoid stopping application threads for too long).",
        "Maintain high memory throughput and prevent fragmentation."
      ]
    },
    estimations: "Manages gigabytes of heap memory. Object life cycles are short: ~90% of objects die shortly after allocation.",
    apis: [
      { method: "Runtime API", path: "Internal Engine", desc: "Allocate and track objects on the heap", request: "Object size", response: "Memory reference pointer" }
    ],
    dataModel: {
      type: "Generational Heap Memory Layout (Eden, Survivor, Tenured spaces)",
      schema: "Object Header Metadata:\n- markBit (boolean)\n- age (integer)\n- referencePointers: List of memory addresses"
    },
    highLevelFlow: [
      { from: "Application Thread", to: "GC Allocator", label: "Request object memory" },
      { from: "GC Allocator", to: "Eden Space", label: "Allocate memory block" },
      { from: "GC Engine", to: "Eden Space", label: "Eden Full: Run Minor GC (Mark and Copy survivors)" },
      { from: "GC Engine", to: "Tenured Space", label: "Promote old surviving objects" }
    ],
    deepDive: "Uses Generational Collection: heap memory is split into Young and Old generations. New objects are allocated in the Eden space. Minor collections copy surviving objects to Survivor spaces. If an object survives multiple cycles, it is promoted to the Old generation, which is collected less frequently using mark-and-sweep algorithms.",
    tradeoffs: "Generational collection is optimized for short-lived objects. If an application creates many long-lived objects, it triggers frequent, slow collections in the Old generation."
  },
  {
    id: 34,
    title: "Design Dynamic Pricing Engine (Uber Surge)",
    category: "Distributed Systems",
    difficulty: "Medium",
    summary: "A real-time pricing engine that adjusts prices based on supply and demand shifts.",
    requirements: {
      functional: [
        "Calculate ride price multipliers dynamically based on local ride demand.",
        "Update pricing multipliers for geographic areas in real-time."
      ],
      nonFunctional: [
        "Low calculation latency (< 100ms).",
        "Scalable: Handle millions of location updates and pricing calculations."
      ]
    },
    estimations: "1 million active drivers and passengers. Location updates QPS: ~250,000. Price calculation QPS: ~5,000.",
    apis: [
      { method: "GET", path: "/api/v1/price", desc: "Calculate ride fare", request: "pickupLat, pickupLng, dropLat, dropLng", response: "{ \"fare\": 22.50, \"surgeMultiplier\": 1.5 }" }
    ],
    dataModel: {
      type: "In-memory Grid Store (Redis) + Stream processing pipeline",
      schema: "SurgeCell:\n- cellId (varchar, PK)\n- activeDemandsCount (int)\n- activeDriversCount (int)\n- multiplier (double)\n- lastUpdated (timestamp)"
    },
    highLevelFlow: [
      { from: "Passenger App", to: "Surge Service", label: "Search for rides in Geohash cell" },
      { from: "Driver App", to: "Surge Service", label: "Report availability in Geohash cell" },
      { from: "Surge Service", to: "Stream Processor", label: "Calculate supply/demand ratio" },
      { from: "Stream Processor", to: "Surge Cell Cache", label: "Update surge multipliers" }
    ],
    deepDive: "Divides the map into geographic cells using H3 (hexagonal hierarchical spatial index). The system counts active ride requests (demand) and available drivers (supply) within each cell. If the demand-to-supply ratio crosses a threshold, the system calculates a surge multiplier and updates the cell's price index.",
    tradeoffs: "Surge calculations are aggregate estimates. Sharp border lines between cells can cause significantly different prices for users located close to each other."
  },
  {
    id: 35,
    title: "Design a Web Application Firewall (WAF)",
    category: "Infrastructure",
    difficulty: "Medium",
    summary: "A security gateway that filters and blocks malicious HTTP traffic directed at web applications.",
    requirements: {
      functional: [
        "Inspect HTTP requests for patterns of attacks (SQL injection, XSS, Path traversal).",
        "Block malicious requests and log security alerts."
      ],
      nonFunctional: [
        "Ultra-low inspection latency (< 2ms overhead per request).",
        "Scalable: Inspect high-volume HTTP traffic without degrading performance."
      ]
    },
    estimations: "Inspect 50,000 HTTP requests/sec. Signature database contains thousands of regex patterns.",
    apis: [
      { method: "Middleware", path: "Traffic Gateway", desc: "Inspect HTTP headers and request bodies", request: "HTTP Request", response: "Block (403) or Forward Request" }
    ],
    dataModel: {
      type: "In-memory Pattern Index (Aho-Corasick trie matching) + Log store",
      schema: "SecurityRules:\n- ruleId (varchar, PK)\n- patternRegex (varchar)\n- action (BLOCK|LOG|ALLOW)"
    },
    highLevelFlow: [
      { from: "Client", to: "WAF Gateway", label: "Send HTTP Request" },
      { from: "WAF Gateway", to: "Rule Engine", label: "Scan request headers & body" },
      { from: "Rule Engine", to: "WAF Gateway", label: "Signature Matched: Return 403 Forbidden" },
      { from: "WAF Gateway", to: "Backend Servers", label: "Clean Request: Forward payload" }
    ],
    deepDive: "Runs as reverse proxy middleware. Request data is matched against attack signatures using fast string-matching algorithms (like Aho-Corasick), which search for thousands of signatures in a single pass. Anomaly scoring adds up rule matches to detect and block complex, multi-part attacks.",
    tradeoffs: "Deep body inspection provides better security but is CPU-intensive and can cause false positives that block legitimate user requests."
  },
  {
    id: 36,
    title: "Design Service Discovery (e.g., Consul)",
    category: "Infrastructure",
    difficulty: "Medium",
    summary: "A registry service that tracks active microservice instances and allows them to discover each other dynamically.",
    requirements: {
      functional: [
        "Allow service instances to register and deregister their IP addresses.",
        "Provide health checking to automatically remove failing service instances.",
        "Resolve service names to active IP addresses."
      ],
      nonFunctional: [
        "Strict consistency: Prevent services from routing traffic to dead instances.",
        "Highly available: The registry must survive node failures."
      ]
    },
    estimations: "1,000 microservices running 20,000 active instances. Heartbeat frequency: every 5s. Lookup QPS: ~50,000.",
    apis: [
      { method: "POST", path: "/v1/agent/service/register", desc: "Register service instance", request: "{ \"service\": \"payment\", \"ip\": \"10.0.1.5\", \"port\": 8080 }", response: "200 OK" },
      { method: "GET", path: "/v1/catalog/service/{name}", desc: "Discover active instances of service", request: "None", response: "[{ \"ip\": \"10.0.1.5\", \"port\": 8080 }]" }
    ],
    dataModel: {
      type: "Consistent Key-Value database (Raft consensus)",
      schema: "ServiceRegistry:\n- serviceName (varchar)\n- instanceId (varchar, PK)\n- ipAddress (varchar)\n- port (int)\n- healthStatus (enum)\n- lastHeartbeat (timestamp)"
    },
    highLevelFlow: [
      { from: "Payment Instance", to: "Consul Node", label: "POST /register (IP: 10.0.1.5)" },
      { from: "Consul Node", to: "Raft Consensus Cluster", label: "Replicate instance registration" },
      { from: "Gateway proxy", to: "Consul Node", label: "Query: Where is payment service?" },
      { from: "Consul Node", to: "Gateway proxy", label: "Return active instance IP: 10.0.1.5" }
    ],
    deepDive: "Uses Raft consensus to synchronize the registry across discovery nodes. Client instances send periodic heartbeats (every 5-10 seconds) to Consul. If an instance fails to send heartbeats, Consul flags it as unhealthy and removes it from service lookup results.",
    tradeoffs: "Using strict consensus protocols guarantees accuracy but limits write throughput when scaling to millions of rapid instance registrations."
  },
  {
    id: 37,
    title: "Design Software Load Balancer (Nginx)",
    category: "Infrastructure",
    difficulty: "Medium",
    summary: "A high-performance reverse proxy that distributes client HTTP traffic across a pool of backend servers.",
    requirements: {
      functional: [
        "Accept incoming TCP/HTTP connections from clients.",
        "Distribute requests across a pool of backend servers using load-balancing algorithms (Round Robin, Least Connections)."
      ],
      nonFunctional: [
        "Ultra-low routing latency (< 1ms overhead).",
        "High throughput: Handle 100,000+ concurrent connections.",
        "Support SSL termination and session persistence."
      ]
    },
    estimations: "100k concurrent connections. Throughput: ~10 Gbps. Memory usage: ~1MB per 10,000 connections.",
    apis: [
      { method: "Reverse Proxy", path: "Inbound Network", desc: "Proxy client traffic to backend servers", request: "Client TCP connection", response: "Forwarded Server response" }
    ],
    dataModel: {
      type: "In-memory Routing Table + active health check status list",
      schema: "BackendPool:\n- backendId (varchar)\n- ipAddress (varchar)\n- activeConnections (int)\n- weight (int)\n- isHealthy (boolean)"
    },
    highLevelFlow: [
      { from: "Client", to: "Load Balancer", label: "TCP Handshake / Send HTTP GET" },
      { from: "Load Balancer", to: "Routing Table", label: "Select backend server (e.g. Least Connections)" },
      { from: "Load Balancer", to: "Selected Backend", label: "Proxy HTTP request" },
      { from: "Selected Backend", to: "Load Balancer", label: "Return HTTP response" }
    ],
    deepDive: "Uses an event-driven, non-blocking I/O loop (such as epoll or kqueue) to manage thousands of active client connections on a single thread. It supports SSL termination at the balancer level, offloading encryption tasks to free up backend server CPU capacity.",
    tradeoffs: "A software load balancer can become a single point of failure (SPOF) for the system if it goes offline, requiring active-passive failover pairs."
  },
  {
    id: 38,
    title: "Design Geohash Taxi Dispatcher",
    category: "Real-Time / Geo",
    difficulty: "Hard",
    summary: "A dispatch system that groups drivers and passengers into geohash grid cells to automate taxi dispatching.",
    requirements: {
      functional: [
        "Group available drivers and pending ride requests into geohash grid cells.",
        "Match and dispatch drivers to passengers within the same or adjacent cells."
      ],
      nonFunctional: [
        "Low matching latency (< 1 second).",
        "Scalable: Handle thousands of location updates and match queries concurrently."
      ]
    },
    estimations: "500,000 active users. Location updates: every 3s. Matching throughput: ~1,000 matches/sec. Low-memory geospatial index required.",
    apis: [
      { method: "POST", path: "/api/v1/dispatch", desc: "Request immediate taxi dispatch", request: "{ \"userId\": \"uuid\", \"currentLocation\": \"[lat,lng]\" }", response: "{ \"driverId\": \"uuid\", \"etaMinutes\": 5 }" }
    ],
    dataModel: {
      type: "In-memory grid index (Redis Geohash keys)",
      schema: "GeohashQueue:\n- key: String (e.g. dispatch:geohash:wq07t)\n- members: Set of available driver IDs"
    },
    highLevelFlow: [
      { from: "Driver App", to: "Dispatch Gateway", label: "Report GPS location" },
      { from: "Dispatch Gateway", to: "Geohash Index", label: "Add driver to Geohash cell queue" },
      { from: "Passenger App", to: "Dispatch Engine", label: "Request Taxi" },
      { from: "Dispatch Engine", to: "Geohash Index", label: "Match with first driver in cell queue" }
    ],
    deepDive: "Converts GPS coordinates into 5-character Geohash strings, mapping drivers to 4.9km x 4.9km cells. The dispatch engine runs matching loops: when a ride is requested, the engine matches the passenger with the first available driver in their Geohash cell or searches adjacent cells.",
    tradeoffs: "Fixed Geohash boundaries can split adjacent drivers and passengers into different cells, requiring the engine to scan adjacent cells."
  },
  {
    id: 39,
    title: "Design Fraud Detection System",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A real-time analytics system that scores financial transactions to block fraudulent payments.",
    requirements: {
      functional: [
        "Analyze transactions in real-time to generate fraud scores.",
        "Block high-risk transactions during the payment flow."
      ],
      nonFunctional: [
        "Low latency: Score transactions in < 50ms to prevent payment delays.",
        "High availability: The scoring system must not block payment processing if it fails."
      ]
    },
    estimations: "100 million transactions daily. QPS: ~1,200. Peak QPS: ~5,000. Feature store memory size: ~500GB.",
    apis: [
      { method: "POST", path: "/api/v1/fraud/score", desc: "Score transaction risk", request: "{ \"userId\": \"uuid\", \"amount\": 150.00, \"ip\": \"string\" }", response: "{ \"riskScore\": 85, \"action\": \"BLOCK\" }" }
    ],
    dataModel: {
      type: "In-memory Feature Store (Redis) + Document DB (MongoDB) for audit logs",
      schema: "UserFeatures:\n- userId (PK)\n- txCount1h (int)\n- uniqueIps24h (list)\n- averageTxAmount30d (double)"
    },
    highLevelFlow: [
      { from: "Payment Gateway", to: "Fraud Service", label: "POST /score" },
      { from: "Fraud Service", to: "Feature Store", label: "Read user history metrics" },
      { from: "Fraud Service", to: "ML Inference Engine", label: "Calculate risk score" },
      { from: "Fraud Service", to: "Payment Gateway", label: "Return action: BLOCK or ALLOW" }
    ],
    deepDive: "Uses an in-memory feature store to track real-time user metrics (like transaction frequency and IP history). A machine learning model uses these features to score transaction risk. If the score crosses a threshold, the system blocks the transaction or triggers multi-factor authentication.",
    tradeoffs: "Maintaining real-time feature caches is memory-intensive. The system accepts eventual consistency for features updated via offline pipelines."
  },
  {
    id: 40,
    title: "Design Password Manager (LastPass)",
    category: "Web Applications",
    difficulty: "Easy",
    summary: "A secure password vault that stores encrypted user credentials and syncs them across devices.",
    requirements: {
      functional: [
        "Store encrypted website credentials.",
        "Synchronize credential vaults across multiple user devices.",
        "Generate secure, random passwords."
      ],
      nonFunctional: [
        "Zero-Knowledge Security: User passwords must be encrypted client-side; the server must never see plaintext passwords or master keys.",
        "Reliable synchronization."
      ]
    },
    estimations: "5 million users. Average vault size: 500KB. Total vault storage: ~2.5TB. Low read/write traffic.",
    apis: [
      { method: "POST", path: "/api/v1/vault/sync", desc: "Upload/Sync encrypted vault", request: "Encrypted blob payload", response: "Success confirmation" },
      { method: "GET", path: "/api/v1/vault", desc: "Download encrypted vault", request: "Authentication token", response: "Encrypted blob payload" }
    ],
    dataModel: {
      type: "Relational DB (PostgreSQL) storing encrypted binary blobs",
      schema: "UserVault:\n- userId (uuid, PK)\n- encryptedVault (blob)\n- vaultVersion (int)\n- masterKeyHash (varchar, used to verify authentication)"
    },
    highLevelFlow: [
      { from: "Client Browser", to: "Vault Cryptor", label: "Encrypt vault client-side using PBKDF2 Master Key" },
      { from: "Client Browser", to: "Vault API Server", label: "Upload encrypted vault blob" },
      { from: "Vault API Server", to: "Database", label: "Overwrite encrypted vault blob" },
      { from: "Client Device 2", to: "Vault API Server", label: "Download encrypted vault blob & decrypt locally" }
    ],
    deepDive: "Uses client-side encryption: the master password is run through a key derivation function (like PBKDF2 or Argon2) to generate encryption keys. The vault is encrypted using AES-256 before being sent to the server. The server only sees and stores encrypted binary blobs, ensuring security even if the database is breached.",
    tradeoffs: "Because the server has zero knowledge of the master key, it cannot recover user vaults if the master password is lost."
  },
  {
    id: 41,
    title: "Design Zoom / Google Meet (Video Conferencing)",
    category: "Real-Time / Geo",
    difficulty: "Hard",
    summary: "A real-time video conferencing platform that streams low-latency video and audio across multi-user meetings.",
    requirements: {
      functional: [
        "Support multi-user video and audio calls.",
        "Allow users to share screens during calls.",
        "Provide text chat within call rooms."
      ],
      nonFunctional: [
        "Ultra-low video latency (< 200ms end-to-end).",
        "Maintain audio-video synchronization.",
        "Gracefully adjust quality under poor network conditions."
      ]
    },
    estimations: "50 million daily meeting minutes. Concurrent meetings: ~10,000. Dynamic bandwidth allocation required.",
    apis: [
      { method: "POST", path: "/api/v1/rooms/create", desc: "Create video conference room", request: "roomDetails", response: "{ \"roomId\": \"string\", \"signalServerIp\": \"string\" }" }
    ],
    dataModel: {
      type: "In-memory session registry + WebRTC signaling servers",
      schema: "ActiveRoom:\n- roomId (varchar, PK)\n- participants: List of participant IDs\n- mediaServerIp: String"
    },
    highLevelFlow: [
      { from: "Participant A", to: "Signaling Server", label: "Handshake: Exchange WebRTC SDP profiles" },
      { from: "Participant A", to: "Selective Forwarding Unit (SFU)", label: "Stream video/audio upload via WebRTC (UDP)" },
      { from: "Selective Forwarding Unit (SFU)", to: "Participant B", label: "Forward A's video stream" }
    ],
    deepDive: "Uses a Selective Forwarding Unit (SFU) architecture: each participant uploads their video stream once, and the SFU forwards it to the other participants. This reduces client upload bandwidth compared to peer-to-peer mesh networks. The system streams media over UDP using WebRTC to minimize connection overhead.",
    tradeoffs: "SFUs process and forward large volumes of video traffic, which increases hosting and bandwidth costs compared to serverless peer-to-peer networks."
  },
  {
    id: 42,
    title: "Design a Cloud Drive (e.g., Dropbox / Google Drive)",
    category: "Web Applications",
    difficulty: "Medium",
    summary: "A file storage and synchronization service that syncs user files across multiple devices.",
    requirements: {
      functional: [
        "Allow users to upload, download, and delete files.",
        "Synchronize file changes automatically across registered devices.",
        "Provide file version history and recovery."
      ],
      nonFunctional: [
        "Reliable file synchronization: Files must not be corrupted or lost.",
        "Optimize uploads: Minimize bandwidth usage by only uploading changed file segments."
      ]
    },
    estimations: "50 million active users. Average 10GB storage per user. Total capacity: 500PB. Daily upload bandwidth: ~50 Gbps.",
    apis: [
      { method: "POST", path: "/api/v1/files/upload", desc: "Upload file chunk", request: "Multipart file chunk data", response: "{ \"chunkId\": \"string\" }" },
      { method: "GET", path: "/api/v1/files/changes", desc: "Poll for file changes", request: "lastSyncToken", response: "List of modified files metadata" }
    ],
    dataModel: {
      type: "Object Storage (Amazon S3) + Relational DB (PostgreSQL) for file metadata",
      schema: "FileMetadata:\n- fileId (uuid, PK)\n- userId (uuid)\n- filename (varchar)\n- path (varchar)\n- checksum (varchar, matches file hash)\n- version (int)\n- isDeleted (boolean)"
    },
    highLevelFlow: [
      { from: "Client App", to: "Sync Service", label: "Scan directory changes" },
      { from: "Client App", to: "Block Service", label: "Split modified files into 4MB chunks" },
      { from: "Client App", to: "Object Storage (S3)", label: "Upload modified chunks only" },
      { from: "Client App", to: "Metadata DB", label: "Save new file version details" }
    ],
    deepDive: "Splits large files into smaller 4MB chunks and calculates hashes (SHA-256) for each chunk. When a file is modified, the client app only uploads the chunks that changed (delta sync), saving bandwidth. A Notification Server uses long polling to notify other devices of changes to trigger downloads.",
    tradeoffs: "Delta sync reduces network usage but increases metadata complexity, requiring the system to track and reconstruct files from multiple chunks."
  },
  {
    id: 43,
    title: "Design Real-time Leaderboard (Gaming)",
    category: "Real-Time / Geo",
    difficulty: "Easy",
    summary: "A real-time gaming leaderboard that tracks and ranks player scores dynamically.",
    requirements: {
      functional: [
        "Update player scores dynamically.",
        "Retrieve the top 100 players on the leaderboard.",
        "Retrieve a specific player's current rank."
      ],
      nonFunctional: [
        "Low update latency (< 50ms).",
        "Scalable: Handle millions of active players and score updates."
      ]
    },
    estimations: "5 million daily active players. Score updates QPS: ~2,000. Read leaderboard QPS: ~10,000.",
    apis: [
      { method: "POST", path: "/api/v1/scores", desc: "Update player score", request: "{ \"playerId\": \"string\", \"score\": 1500 }", response: "{ \"rank\": 452 }" },
      { method: "GET", path: "/api/v1/leaderboard", desc: "Get top 100 ranks", request: "None", response: "{ \"leaderboard\": [] }" }
    ],
    dataModel: {
      type: "In-memory database (Redis Sorted Sets)",
      schema: "Leaderboard Redis Index:\n- key: String (e.g. game:leaderboard:season_1)\n- members: Set of player IDs scored by their integers (ZADD)"
    },
    highLevelFlow: [
      { from: "Game Server", to: "Leaderboard Service", label: "POST /scores" },
      { from: "Leaderboard Service", to: "Redis Sorted Set", label: "Update player score (ZADD)" },
      { from: "Client App", to: "Leaderboard Service", label: "GET /leaderboard" },
      { from: "Leaderboard Service", to: "Redis Sorted Set", label: "Fetch top 100 range (ZRANGE)" }
    ],
    deepDive: "Uses Redis Sorted Sets (using skip list data structures). This allows the system to add player scores and calculate ranks in O(log N) time. The leaderboard can be queried for ranges (e.g., top 100 players) in O(log N + M) time, serving high read traffic from memory.",
    tradeoffs: "Redis stores the entire leaderboard in RAM, which limits the number of players that can be tracked in a single set without sharding by region or division."
  },
  {
    id: 44,
    title: "Design Highly Available DNS Server",
    category: "Infrastructure",
    difficulty: "Hard",
    summary: "A distributed DNS server network that resolves domain names to IP addresses with low latency.",
    requirements: {
      functional: [
        "Resolve domain name queries to target IP addresses.",
        "Support DNS record updates (A, AAAA, CNAME, MX)."
      ],
      nonFunctional: [
        "Ultra-low latency footprint (< 10ms resolution).",
        "High availability (DNS resolution must never go offline).",
        "Resilient against DDoS attacks."
      ]
    },
    estimations: "Millions of DNS queries per second. Global coverage. IP maps are small and fit in memory.",
    apis: [
      { method: "UDP query", path: "Port 53", desc: "Resolve domain name query", request: "DNS Query Packet", response: "DNS Resource Record" }
    ],
    dataModel: {
      type: "In-memory Key-Value lookup tables + Zone files",
      schema: "DNSRecord:\n- domainName (varchar, PK)\n- recordType (A|AAAA|CNAME)\n- ipAddress (varchar)\n- ttlSeconds (int)"
    },
    highLevelFlow: [
      { from: "Client Resolver", to: "Root Server", label: "Query: Where is app.com?" },
      { from: "Root Server", to: "TLD Server", label: "Redirect: Query .com Name Server" },
      { from: "TLD Server", to: "Authoritative Server", label: "Redirect: Query app.com DNS host" },
      { from: "Authoritative Server", to: "Client Resolver", label: "Return IP Address 192.168.1.5" }
    ],
    deepDive: "Runs over UDP on Port 53 to avoid the latency of TCP handshakes. The system uses a hierarchical structure (Root -> TLD -> Authoritative name servers). Anycast Routing directs client requests to the closest physical DNS node, while aggressive caching at client routers minimizes queries to authoritative servers.",
    tradeoffs: "UDP does not verify source IPs, which makes DNS servers vulnerable to amplification DDoS attacks, requiring active rate-limiters at the gateway."
  },
  {
    id: 45,
    title: "Design Webhooks Provider Platform",
    category: "Distributed Systems",
    difficulty: "Medium",
    summary: "A webhook service that delivers event notifications from core APIs to merchant servers.",
    requirements: {
      functional: [
        "Register destination URLs for specific event types.",
        "Deliver event payloads to destination URLs when events trigger."
      ],
      nonFunctional: [
        "Reliable delivery: Retry failed requests using exponential backoff.",
        "Scale: Process thousands of webhook events per second."
      ]
    },
    estimations: "50 million webhooks daily. QPS: ~600. Peak QPS: ~3,000. Average payload size: 2KB.",
    apis: [
      { method: "POST", path: "/api/v1/webhooks/subscribe", desc: "Register webhook endpoint", request: "{ \"url\": \"string\", \"events\": [\"order.created\"] }", response: "{ \"subscriptionId\": \"string\", \"secretKey\": \"string\" }" }
    ],
    dataModel: {
      type: "NoSQL DB (Cassandra) for logs + Relational DB for subscription details",
      schema: "WebhookLog:\n- logId (uuid, PK)\n- eventId (uuid)\n- destinationUrl (varchar)\n- responseStatus (int)\n- payload (text)\n- attemptCount (int)\n- nextAttemptTime (timestamp)"
    },
    highLevelFlow: [
      { from: "Order Service", to: "Webhook Service", label: "Publish Event: order.created" },
      { from: "Webhook Service", to: "Message Queue (Kafka)", label: "Enqueue delivery task" },
      { from: "Delivery Worker", to: "Merchant Server", label: "POST Event payload" },
      { from: "Delivery Worker", to: "Database", label: "Log response & schedule retry if failed" }
    ],
    deepDive: "Uses message queues (Kafka) to buffer events. If a merchant server is offline, delivery workers retry requests using exponential backoff over a 24-hour period. Webhook payloads are signed with a secret key (`X-Webhook-Signature` header) so merchant servers can verify that requests are authentic.",
    tradeoffs: "Retrying failed deliveries increases system queue size, which requires dedicated retry queues to prevent blocking new events."
  },
  {
    id: 46,
    title: "Design a Recommendation Engine",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A machine learning pipeline that calculates and displays personalized product recommendations to users.",
    requirements: {
      functional: [
        "Display personalized product recommendations on the home screen.",
        "Update recommendations based on recent user actions."
      ],
      nonFunctional: [
        "Low display latency (< 100ms).",
        "Highly accurate: Show relevant recommendations to increase conversion rates."
      ]
    },
    estimations: "100 million active users. Catalog size: 10 million items. Recommendation calculations are processed in batches offline.",
    apis: [
      { method: "GET", path: "/api/v1/recommendations", desc: "Retrieve personalized product suggestions", request: "Query Params (userId)", response: "{ \"recommendations\": [] }" }
    ],
    dataModel: {
      type: "Vector Database (Pinecone) + Document Store (MongoDB) for recommendations lists",
      schema: "UserRecommendations:\n- userId (uuid, PK)\n- recommendedIds: Array of product IDs\n- scores: Array of match confidence ratings\n- lastUpdated (timestamp)"
    },
    highLevelFlow: [
      { from: "User Client", to: "API Gateway", label: "Log user views / purchases" },
      { from: "API Gateway", to: "Interaction Logger", label: "Track interaction events" },
      { from: "ML Pipeline (Offline)", to: "Interaction Logger", label: "Train collaborative filtering models" },
      { from: "ML Pipeline (Offline)", to: "Recommendations DB", label: "Save pre-computed user matches lists" }
    ],
    deepDive: "Splits recommendation generation into online and offline pipelines. The offline pipeline runs ML models (like collaborative filtering or deep learning) on user interaction logs to pre-compute recommendation lists. The online API server simply reads these lists from a document database, hitting sub-50ms latencies.",
    tradeoffs: "Pre-computing recommendations offline reduces API latency but means suggestions do not immediately reflect a user's most recent search actions."
  },
  {
    id: 47,
    title: "Design SaaS Billing Engine (Multi-Tenant)",
    category: "Web Applications",
    difficulty: "Medium",
    summary: "A billing and subscription service that manages multi-tenant pricing plans, invoices, and card charges.",
    requirements: {
      functional: [
        "Support multiple pricing models (flat rate, tiered, usage-based).",
        "Track usage metrics for billing calculations.",
        "Generate monthly invoices and process payments."
      ],
      nonFunctional: [
        "Strict transaction consistency: Zero billing or audit errors.",
        "Security: Compliant with PCI-DSS standards.",
        "Idempotent payment requests."
      ]
    },
    estimations: "10,000 tenants with 10M end-users. Daily billing events: 100 million. Usage tracking QPS: ~1,500.",
    apis: [
      { method: "POST", path: "/api/v1/billing/usage", desc: "Log tenant usage event", request: "{ \"tenantId\": \"string\", \"userId\": \"string\", \"metric\": \"api_calls\", \"quantity\": 1 }", response: "200 OK" }
    ],
    dataModel: {
      type: "ACID Relational DB (PostgreSQL) + Redis for usage aggregation",
      schema: "TenantSubscription:\n- id (uuid, PK)\n- tenantId (varchar)\n- planId (varchar)\n- status (varchar)\n- billingCycleStart (timestamp)\n- billingCycleEnd (timestamp)"
    },
    highLevelFlow: [
      { from: "SaaS Application", to: "Usage API", label: "Report usage metrics" },
      { from: "Usage API", to: "Redis Cache", label: "Increment usage counters" },
      { from: "Billing Engine (Cron)", to: "Redis Cache", label: "Aggregate usage at end of billing cycle" },
      { from: "Billing Engine (Cron)", to: "Payment Service (Stripe)", label: "Charge payment card and save invoice" }
    ],
    deepDive: "Saves usage events to Redis counters to prevent slow database writes. At the end of each billing cycle, a cron job reads the counters, calculates the bill based on the tenant's pricing plan, generates an invoice, and charges the card using Stripe.",
    tradeoffs: "Aggregating usage events in memory is fast but requires writing backup event logs to disk to prevent data loss if the cache server crashes."
  },
  {
    id: 48,
    title: "Design Image Resizer CDN",
    category: "Infrastructure",
    difficulty: "Easy",
    summary: "An image processing service that resizes, crops, and optimizes image files on-the-fly.",
    requirements: {
      functional: [
        "Retrieve origin images and resize them based on query parameters (e.g. width=300).",
        "Convert image formats (like PNG to WebP) to minimize file sizes."
      ],
      nonFunctional: [
        "Low processing latency (< 50ms for cached images).",
        "High availability: The system must scale to handle high traffic spikes."
      ]
    },
    estimations: "10 million source images. 100 million requests daily. Average source image: 4MB. Optimized image size: 150KB.",
    apis: [
      { method: "GET", path: "/images/{imageId}", desc: "Fetch resized image", request: "Query Params (w, h, format)", response: "Image binary payload" }
    ],
    dataModel: {
      type: "Object Storage (S3) for source images + Local SSD Edge Caches",
      schema: "CacheManifest:\n- requestHash (String, PK)\n- localCachePath (String)\n- sizeBytes (Long)\n- createdAt (timestamp)"
    },
    highLevelFlow: [
      { from: "Client Browser", to: "CDN Edge Server", label: "Request: image.png?width=200" },
      { from: "CDN Edge Server", to: "Image Resizer Node", label: "Cache Miss: Request resized file" },
      { from: "Image Resizer Node", to: "Object Store (S3)", label: "Fetch source image file" },
      { from: "Image Resizer Node", to: "CDN Edge Server", label: "Resize, convert format, and return" }
    ],
    deepDive: "Uses image processing libraries (like Sharp or libjpeg) on dedicated server nodes. Resized images are cached at the CDN level: subsequent requests for the same dimensions are served from CDN memory, avoiding redundant processing.",
    tradeoffs: "On-the-fly resizing is resource-intensive, requiring robust caching at the edge to prevent image servers from becoming overloaded."
  },
  {
    id: 49,
    title: "Design an API Gateway",
    category: "Infrastructure",
    difficulty: "Medium",
    summary: "A single gateway service that routes requests, authenticates clients, and rate-limits traffic to backend microservices.",
    requirements: {
      functional: [
        "Route inbound HTTP requests to target microservices.",
        "Authenticate clients using JWT or API keys.",
        "Rate-limit incoming traffic."
      ],
      nonFunctional: [
        "Ultra-low latency footprint (< 5ms overhead per request).",
        "High availability: The gateway is the single entry point for all traffic."
      ]
    },
    estimations: "100,000 requests per second. Gateway must be stateless to scale horizontally behind a load balancer.",
    apis: [
      { method: "Any", path: "/*", desc: "Route requests to backend microservices", request: "Inbound payload", response: "Service response" }
    ],
    dataModel: {
      type: "In-memory Routing Table + Redis for session token validation",
      schema: "ClientToken:\n- tokenId (varchar, PK)\n- clientId (varchar)\n- scopes (array)\n- expiresAt (timestamp)"
    },
    highLevelFlow: [
      { from: "Client", to: "API Gateway", label: "Send API Request with JWT" },
      { from: "API Gateway", to: "Token Service", label: "Validate JWT locally or in cache" },
      { from: "API Gateway", to: "Rate Limiter", label: "Verify client request limits" },
      { from: "API Gateway", to: "Backend Microservice", label: "Forward request to target destination" }
    ],
    deepDive: "Uses non-blocking I/O frameworks (like Netty or Spring Cloud Gateway) to manage connections. The gateway validates JWT signatures locally using shared keys, avoiding slow network calls to auth services for every request.",
    tradeoffs: "Adding authentication and rate-limiting to the gateway simplifies backend services but creates a single point of failure (SPOF) that must be scaled carefully."
  },
  {
    id: 50,
    title: "Design a Distributed Transaction Manager (Saga)",
    category: "Distributed Systems",
    difficulty: "Hard",
    summary: "A transaction manager that coordinates distributed updates across multiple microservices using Saga patterns.",
    requirements: {
      functional: [
        "Coordinate transactions across multiple microservices (e.g. Order, Payment, Inventory).",
        "Roll back changes if any service fails (compensating transactions)."
      ],
      nonFunctional: [
        "Ensure system consistency.",
        "Fault tolerance: Survive coordinator node crashes without losing transaction state."
      ]
    },
    estimations: "1 million transactions daily. System state is small; transactions are logged to disk for audit recovery.",
    apis: [
      { method: "POST", path: "/api/v1/transactions", desc: "Start distributed transaction", request: "{ \"steps\": [] }", response: "{ \"txId\": \"string\", \"status\": \"STARTED\" }" }
    ],
    dataModel: {
      type: "State Machine Database (PostgreSQL) + Message Broker (Kafka) for service events",
      schema: "SagaState:\n- txId (uuid, PK)\n- currentStep (varchar)\n- status (RUNNING|COMPLETED|FAILED)\n- compensationPayload (text)\n- updatedAt (timestamp)"
    },
    highLevelFlow: [
      { from: "Order Service", to: "Saga Coordinator", label: "Start Saga: Process Checkout" },
      { from: "Saga Coordinator", to: "Payment Service", label: "Trigger: Charge Card" },
      { from: "Payment Service", to: "Saga Coordinator", label: "Payment Failed" },
      { from: "Saga Coordinator", to: "Inventory Service", label: "Compensate: Release Reserved Stock" }
    ],
    deepDive: "Uses the Saga Pattern: distributed transactions are split into local service transactions. A coordinator tracks the transaction state in a database. If a step fails, the coordinator executes compensating transactions in reverse order to roll back changes, maintaining eventual consistency.",
    tradeoffs: "Sagas use eventual consistency; data modified by active transactions is visible to other queries before the entire Saga finishes."
  },
  {
    id: 51,
    title: "Design a 5 Million Pizza Order System (Delivery Hero)",
    category: "Web Applications",
    difficulty: "Hard",
    summary: "A high-performance food delivery platform processing 5 million pizza orders per day, handling extreme dinner-time peaks, real-time tracking, and automated driver dispatching.",
    requirements: {
      functional: [
        "Allow users to browse restaurant menus, customize pizzas, and place orders.",
        "Provide real-time order status tracking (Placed, Preparing, Dispatched, Delivered).",
        "Provide dashboards for restaurants to manage active preparation queues.",
        "Match and dispatch drivers automatically to nearby pick-up orders."
      ],
      nonFunctional: [
        "Highly available for order placements during peak dinner hours (99.999% ordering uptime).",
        "Transactional consistency for payments, order allocations, and balances.",
        "Driver matching and status notifications must occur under 1 second."
      ]
    },
    estimations: "5M orders/day = ~58 orders/sec average. Peak dinner hour factor is 10x (~600 orders/sec). Peak search QPS is 100x orders = ~60,000 QPS. Storage: 5M orders * 1KB = 5GB/day (1.8TB/year).",
    apis: [
      { method: "POST", path: "/api/v1/orders", desc: "Create a new order", request: "{ \"cartId\": \"string\", \"paymentToken\": \"string\" }", response: "{ \"orderId\": \"uuid\", \"status\": \"PLACED\" }" },
      { method: "GET", path: "/api/v1/orders/{orderId}/status", desc: "Get live order tracking status", request: "None", response: "{ \"orderId\": \"uuid\", \"status\": \"PREPARING\", \"driverCoords\": \"[lat,lng]?\" }" }
    ],
    dataModel: {
      type: "Sharded Relational DB (PostgreSQL) for orders & payments + DynamoDB for historic logs.",
      schema: "Orders Table:\n- orderId (uuid, PK)\n- restaurantId (uuid, Index)\n- userId (uuid)\n- totalAmount (decimal)\n- status (varchar)\n- createdAt (timestamp)\n\nOrderItems Table:\n- itemId (PK)\n- orderId (FK)\n- productDetails (json)"
    },
    highLevelFlow: [
      { from: "Client", to: "API Gateway", label: "POST /orders" },
      { from: "API Gateway", to: "Order Service", label: "Create Order (ACID SQL transaction)" },
      { from: "Order Service", to: "Payment Service", label: "Authorize Payment" },
      { from: "Order Service", to: "Message Queue (Kafka)", label: "Emit OrderPlaced event" },
      { from: "Message Queue (Kafka)", to: "Restaurant Service", label: "Add to kitchen preparation queue" },
      { from: "Message Queue (Kafka)", to: "Dispatch Service", label: "Assign driver via Geohash cell" }
    ],
    deepDive: "Uses the Transactional Outbox Pattern: the Order Service updates database state and appends messages to an Outbox table in the same local SQL transaction, while a separate relay service (Debezium/Kafka Connect) polls this table to publish events to Kafka. This avoids dual-write split-brain problems. Databases are sharded by region (city code) to isolate outages. Driver locations are updated every 4s and stored in memory using Redis Geospatial indexes, allowing the dispatch engine to scan drivers in surrounding Geohash cells under 50ms without touching relational databases.",
    tradeoffs: "Eventual Consistency vs ACID: Relational ACID transactions are locked at order creation to guarantee exact financial and inventory states. However, driver location streams, status tracking, and kitchen alerts use eventual consistency mediated through Kafka to maximize write availability."
  }
];
