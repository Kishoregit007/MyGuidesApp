import { useState, useMemo } from "react";

// ══════════════════════════════════════════════════════════
// COMPLETE Q&A DATA — 135 Questions · 10 Domains
// ══════════════════════════════════════════════════════════
const DOMAIN_SD = {
  id: "sd", title: "System Design", icon: "🏗️", color: "#3b82f6",
  qa: [
    // BASIC
    { level:"Basic", q:"What is the difference between horizontal and vertical scaling?",
      a:`Vertical scaling (scale-up) adds more CPU/RAM to one machine. It has a hard ceiling and creates a single point of failure. Horizontal scaling (scale-out) adds more machines to distribute load.

In banking: stateless services (API gateways, payment processors) scale horizontally — just add pods. Core banking ledgers traditionally scaled vertically (mainframes) due to ACID requirements, but modern systems wrap them with horizontal microservices.

Key trade-off: horizontal scaling introduces distributed system complexity — data consistency, network partitions, partial failures. Vertical is simpler but limited and expensive beyond a point.` },

    { level:"Basic", q:"What is an API Gateway and why is it critical in banking?",
      a:`An API Gateway is the single entry point in front of all backend services. It handles cross-cutting concerns uniformly.

In banking it handles:
• Authentication/authorisation (OAuth 2.0, JWT validation)
• Rate limiting — prevents abuse of payment APIs
• SSL termination
• Request routing to correct microservice
• Correlation ID injection for tracing
• Request/response logging for RBI audit trail

Why critical: Without it, every microservice must independently handle auth, rate limiting, and compliance logging — inconsistently. RBI requires comprehensive audit trails. The gateway enforces this in one place. A missing log in even one service is a compliance gap.` },

    { level:"Basic", q:"Explain REST vs gRPC. When would you use each in banking?",
      a:`REST uses HTTP/1.1 with JSON — human-readable, universally supported, easy to debug and document.
gRPC uses HTTP/2 with Protocol Buffers — binary, strongly typed, faster, supports streaming.

Choose REST for:
• External-facing APIs (mobile banking, Open Banking, third-party integrations) — universal client support
• Regulatory interfaces — auditors need human-readable logs
• Webhook callbacks to merchant systems

Choose gRPC for:
• Internal microservice communication where latency matters — fraud detection calling risk engine
• Real-time streaming — transaction feeds between internal systems
• Polyglot environments — gRPC generates typed clients in any language

Rule of thumb: REST at the edge (public APIs), gRPC internally between services. Never expose gRPC publicly in banking — it complicates compliance logging and client integration.` },

    { level:"Basic", q:"What is a load balancer? What are the different load balancing algorithms?",
      a:`A load balancer distributes incoming requests across multiple server instances to prevent any single instance from being overwhelmed.

Algorithms:
• Round Robin: requests distributed sequentially across servers. Simple, works when all servers are equivalent.
• Least Connections: route to server with fewest active connections. Better when requests have variable processing time — payment processing varies significantly.
• IP Hash: same client IP always goes to same server. Useful for session stickiness in stateful applications.
• Weighted Round Robin: servers with more capacity get proportionally more traffic.
• Random: randomly selects a server. Surprisingly effective at scale.

Banking context:
• Stateless payment APIs: Least Connections works well — processing time varies by transaction complexity
• Session-based internet banking: IP Hash or cookie-based stickiness if sessions aren't externalised to Redis
• Health checks are mandatory — load balancer must stop routing to unhealthy instances within seconds
• In Kubernetes: kube-proxy handles L4 load balancing; Ingress controller handles L7 (host/path routing)` },

    { level:"Basic", q:"What is the difference between synchronous and asynchronous communication in microservices?",
      a:`Synchronous: caller waits for the response before continuing. HTTP/REST and gRPC are synchronous. The entire chain is only as fast as the slowest service.

Asynchronous: caller sends a message and continues. Response (if needed) comes later via callback or polling. Kafka, RabbitMQ are async.

Synchronous use cases in banking:
• Payment initiation — customer waits for confirmation
• Balance inquiry — immediate response needed
• Authentication — must complete before proceeding

Asynchronous use cases in banking:
• Sending SMS/email notifications after payment
• Updating fraud model with new transaction data
• Generating account statements
• Reconciliation jobs
• Audit log writing — write to Kafka, async consumer writes to immutable store

Why async matters in banking: if notification service is synchronous in the payment flow, and it goes down, payments fail. Async decouples — payment succeeds, notification retries independently. This is the key resilience benefit.

Anti-pattern: making everything async for "performance" — you lose the ability to return meaningful errors to the user.` },

    // INTERMEDIATE
    { level:"Intermediate", q:"What is the CAP theorem and how does it apply to banking systems?",
      a:`CAP theorem: a distributed system can guarantee only two of three — Consistency, Availability, Partition Tolerance. Since network partitions are inevitable, you choose between CP and AP during a partition.

Banking application by operation:

CP (Consistency over Availability):
• Account balance debit/credit — must be accurate, never stale
• Payment processing — double-charge from stale state is catastrophic
• Maker-checker approvals — concurrent approval by same person must be prevented
• Accept brief unavailability over returning wrong balance

AP (Availability over Consistency):
• Account statement display — showing 10-second-old statement is acceptable
• Notification delivery — eventual delivery is fine
• Dashboard metrics and reporting — slight staleness acceptable
• Exchange rate display — stale by seconds is fine

Real-world nuance: Pure CAP is a simplification. PACELC extends it — even without partition, there's a trade-off between latency and consistency. Modern databases (CockroachDB, Spanner) offer "tunable consistency" — choose per-transaction. Banking architects specify SERIALIZABLE for writes, READ COMMITTED or even stale reads for non-critical reads.` },

    { level:"Intermediate", q:"What is idempotency and how do you implement it in a payment API?",
      a:`Idempotency means the same operation performed multiple times produces the same result as performing it once. Critical in payments — network timeouts cause clients to retry, risking duplicate charges.

Implementation:
1. Client generates UUID before request, sends as Idempotency-Key header
2. Server checks Redis: has this key been processed?
   — Hit: return stored response (don't reprocess)
   — Miss: acquire distributed lock, process, store result with TTL (24-48 hrs), release lock
3. Return result

Critical details:
• Store the key BEFORE processing begins — prevents race condition where two retries both see "not processed"
• Use Redis SETNX for distributed lock — ensures only one instance processes a given key
• Store the full response, not just "success" — retries get identical responses including errors
• Scope keys to operation type — same UUID for different endpoints must be rejected
• TTL must match business retry window — 24 hrs for payments, shorter for queries

What NOT to do:
• Timestamp-based keys — not unique enough under load
• Checking idempotency after processing — race condition
• Not storing error responses — client gets different error on retry, causing confusion

Stripe, Razorpay, NPCI all implement this pattern. In UPI, the Transaction Reference Number (TRN) serves as the idempotency key across the entire banking network.` },

    { level:"Intermediate", q:"Explain the Saga pattern for distributed transactions in banking.",
      a:`Saga manages distributed transactions across microservices without 2PC. Each step has a local transaction and a compensating (rollback) transaction.

Two types:
• Choreography: services emit and react to events — decoupled but hard to track
• Orchestration: central saga orchestrator directs services step by step — preferred in banking for traceability

Fund Transfer Saga (orchestrated):
1. Orchestrator → Account Service: Debit ₹10,000 from source → success
2. Orchestrator → Ledger Service: Record debit entry → success
3. Orchestrator → Account Service: Credit ₹10,000 to destination → FAILS

Compensation (reverse order):
3a. Orchestrator → Ledger Service: Reverse ledger entry
3b. Orchestrator → Account Service: Reverse debit (credit back source)
3c. Orchestrator → Notification: Inform customer of failure

Why not 2PC?
• 2PC locks resources across all participants during prepare phase — unacceptable latency for payment APIs
• 2PC coordinator is a single point of failure
• 2PC doesn't work across different databases/services with different transaction managers

Critical: compensating transactions must themselves be idempotent — if compensation fails and retries, it must not double-compensate. This is the most common implementation mistake in Saga patterns.` },

    { level:"Intermediate", q:"What is service discovery and how does it work in a banking microservices setup?",
      a:`Service discovery allows microservices to find each other dynamically without hardcoded IPs or URLs. As instances scale up/down, they register/deregister automatically.

Two patterns:

CLIENT-SIDE DISCOVERY:
• Each service queries a service registry (Consul, Eureka) to get available instances
• Client applies load balancing logic itself
• Used in: Spring Cloud with Eureka (common in Indian banking fintech stacks)

SERVER-SIDE DISCOVERY:
• Client calls a load balancer/router; the router queries the registry
• Client doesn't know about discovery — simpler client code
• Used in: Kubernetes (kube-proxy + DNS-based discovery)

In Kubernetes (most modern banking platforms):
• Each service gets a DNS name: payment-service.banking-prod.svc.cluster.local
• kube-proxy maintains iptables rules for routing
• Service registers/deregisters automatically via pod lifecycle
• Liveness and readiness probes prevent routing to unhealthy pods

Service mesh (Istio/Linkerd) adds to this:
• mTLS between all services automatically
• Circuit breaking, retries, timeouts configured at infrastructure level
• Traffic splitting for canary deployments
• Distributed tracing injection

Banking-specific consideration: service registry must be highly available — if it goes down and services can't discover each other, the entire platform fails. Run Consul or etcd in cluster mode (3+ nodes) with quorum.` },

    { level:"Intermediate", q:"What is circuit breaking? Design a circuit breaker for a banking service.",
      a:`A circuit breaker prevents cascading failures by stopping calls to a failing service, giving it time to recover.

Three states:
• CLOSED: normal operation, all calls pass through
• OPEN: service is failing, all calls immediately return error (no actual call made)
• HALF-OPEN: after timeout, allow one test call — success closes circuit, failure keeps it open

Configuration for banking:
• Failure threshold: open after 50% failure rate in 10-second window (or 5 consecutive failures)
• Open duration: 30 seconds before trying HALF-OPEN
• Success threshold in HALF-OPEN: 3 consecutive successes to close

Banking implementation example — Payment Service calling Account Service:

Without circuit breaker: Account Service slow → Payment Service threads pile up waiting → Payment Service exhausts thread pool → Payment Service goes down too (cascading failure)

With circuit breaker:
• Account Service starts failing → circuit opens after threshold
• Payment Service immediately returns "service unavailable" — fast fail
• Payment Service thread pool remains healthy
• After 30 seconds, circuit tries HALF-OPEN → Account Service recovered → circuit closes

Fallback strategies (what to return when circuit is open):
• Balance inquiry: return cached balance with staleness warning
• Payment processing: queue the payment for retry when service recovers
• Fraud check: fail-open (allow transaction, flag for manual review) or fail-closed (reject) — business decision

In Java: Resilience4j is the standard library. In service mesh: Istio handles circuit breaking at infrastructure level without code changes.` },

    { level:"Intermediate", q:"What is the difference between synchronous REST and event-driven architecture? When do you choose event-driven in banking?",
      a:`Synchronous REST: Service A calls Service B, waits for response. Tight coupling — B must be available for A to succeed.

Event-driven: Service A publishes an event to a broker. Service B (and C, D) consume it independently. Loose coupling — B's availability doesn't affect A.

Choose event-driven in banking when:

MULTIPLE CONSUMERS need the same data:
• Payment completed → fraud analysis service, notification service, audit service, reconciliation service all need it. With REST, payment service must call all four. With events, it publishes once — all consume independently.

RESILIENCE is more important than immediacy:
• Notification of payment receipt can be slightly delayed. If notification service is down, Kafka holds the event — no data loss. With REST, you'd need complex retry logic.

AUDIT AND REPLAY:
• Kafka retains all events. If fraud detection model is updated, replay 30 days of transactions to re-score. Impossible with REST — you'd need to re-query and reconstruct.

PEAK LOAD SMOOTHING:
• Month-end statement generation: millions of events queued in Kafka, processed at sustainable rate. With synchronous calls, burst traffic would overwhelm statement service.

Choose synchronous REST when:
• User is waiting for an immediate response (balance inquiry, payment confirmation)
• Strong consistency required (can't proceed without knowing B's response)
• Simple request-reply semantics needed` },

    { level:"Intermediate", q:"How would you design a rate limiter for a banking API?",
      a:`Rate limiting prevents API abuse, protects backend services, and ensures fair usage across customers.

Algorithms:

TOKEN BUCKET (most common for banking APIs):
• Each client has a bucket with N tokens
• Each request consumes one token
• Tokens refill at rate R per second
• If bucket empty: request rejected (429 Too Many Requests)
• Allows burst up to bucket size, then sustained rate

SLIDING WINDOW:
• Count requests in last N seconds using a rolling window
• More accurate than fixed windows (no boundary spike problem)
• Implementation: Redis sorted set with timestamp as score

FIXED WINDOW:
• Count requests per fixed time window (per minute, per hour)
• Simple but allows 2x burst at window boundary

For banking APIs, I'd implement:

PER CLIENT (API key / customer ID):
• Standard: 100 requests/minute
• Bulk payment upload: 10 requests/minute (higher cost per request)
• Balance inquiry: 300 requests/minute (read-heavy, lower cost)

GLOBAL:
• Total API throughput cap to protect backend at 10,000 TPS

Implementation with Redis:
MULTI command:
  INCR rate:{clientId}:{windowMinute}
  EXPIRE rate:{clientId}:{windowMinute} 60
If count > limit: reject with 429, include Retry-After header

Response headers to include:
• X-RateLimit-Limit: 100
• X-RateLimit-Remaining: 47
• X-RateLimit-Reset: 1718000060 (epoch when window resets)

Distributed rate limiting: Redis cluster shared across all API gateway instances — consistent counts regardless of which gateway instance handles the request.` },

    { level:"Intermediate", q:"What is eventual consistency? Give a banking example where it is and isn't acceptable.",
      a:`Eventual consistency means that given no new updates, all replicas will eventually converge to the same value. During the convergence window, different nodes may return different values.

ACCEPTABLE in banking:

Account statement view:
• Statement showing a transaction from 2 seconds ago as "pending" is acceptable
• The transaction is recorded and will appear — just slight lag
• No financial harm from showing slightly stale history

Notification delivery:
• SMS/email arriving 1-2 seconds after payment is acceptable
• The payment itself was atomic; notification is informational

Dashboard analytics:
• "Total transactions today: 45,231" being 30 seconds stale is acceptable
• Used for display, not decision-making

Fraud model feature updates:
• Updating fraud model with new transaction data can be slightly delayed
• Real-time rules still run synchronously; ML features are eventually consistent

NOT ACCEPTABLE in banking:

Account balance during debit:
• Must be strongly consistent — stale balance could allow overdraft
• Two concurrent withdrawals must both see the post-first-withdrawal balance

Payment processing:
• Cannot allow two systems to process the same payment with stale "not yet processed" status
• Idempotency checks must be strongly consistent

Maker-checker status:
• Checker must see the current approval status — stale "pending" could allow double approval

Regulatory reporting:
• Submitted figures must be accurate at point of submission — no eventual consistency

Design principle: Default to strong consistency in banking. Explicitly choose eventual consistency only when you can articulate the acceptable failure mode.` },

    { level:"Intermediate", q:"What is API versioning and how do you manage it in a banking context?",
      a:`API versioning allows you to evolve APIs without breaking existing clients. Critical in banking where multiple clients (mobile apps, corporate portals, third-party integrators) may be on different versions simultaneously.

Versioning strategies:

URI VERSIONING: /api/v1/payments, /api/v2/payments
• Most explicit and visible
• Easy to route at gateway level
• Banking standard — used by RBI Open Banking APIs, Stripe, Razorpay
• Recommended for external banking APIs

HEADER VERSIONING: Accept: application/vnd.bank.v2+json
• Clean URLs but harder to test in browser
• Used for internal APIs between microservices

QUERY PARAMETER: /payments?version=2
• Simple but pollutes query params
• Not recommended for banking

Banking-specific considerations:

DEPRECATION POLICY:
• Announce deprecation 12 months in advance (corporate clients need long lead time)
• Run v1 and v2 simultaneously during transition
• Send deprecation warnings in response headers: Sunset: Sat, 01 Jun 2025 00:00:00 GMT
• Never delete a version without confirming zero active clients

BACKWARD COMPATIBILITY RULES (never break without version bump):
• Never remove a field from response
• Never change field type (string → number)
• Never change semantics of existing field
• CAN add new optional fields without version bump
• CAN add new optional request parameters without version bump

RBI Open Banking mandates specific versioning — Account Aggregator APIs have strict versioning requirements with NBFC-AA compliance tied to version compliance.` },

    // ADVANCED
    { level:"Advanced", q:"Design a payment processing system handling 10,000 TPS.",
      a:`Structure answer in layers:

INGESTION:
• API Gateway cluster (active-active, 3 AZs) with rate limiting per merchant
• Idempotency check at gateway: Redis SETNX on payment UUID — sub-1ms
• Request validation and basic fraud pre-screening (rules engine, < 10ms)
• Stateless payment API pods — scale horizontally

PROCESSING:
• Valid requests → Kafka topic: payment_requests, partitioned by account_id (guarantees ordering per account)
• Payment processor consumers: one pod per partition — no concurrent processing for same account
• Each consumer: fetch account → validate → debit → update ledger → publish result event
• Circuit breakers on all downstream calls
• Target: 200ms p99 processing time

PERSISTENCE:
• CockroachDB or PostgreSQL with synchronous replicas
• Outbox pattern: ledger write + Kafka result event in one DB transaction
• Read replicas for balance queries (separated from write path)
• Connection pooling: PgBouncer, pool size tuned to DB max_connections

AT 10,000 TPS:
• Kafka: 50 partitions × 200 TPS each
• DB: write throughput ~5,000 TPS (payment + ledger per transaction)
• Redis: idempotency cache, 1M ops/sec on cluster — easily handles 10K TPS

FAILURE HANDLING:
• Account service down → circuit opens → payments queued in Kafka → resume on recovery
• DB write failure → Kafka consumer does not commit offset → reprocesses (idempotent handlers)
• Partial Saga failure → compensating transactions auto-triggered by orchestrator

SCALING STRATEGY:
• 10K TPS baseline: 50 Kafka partitions, 50 consumer pods, 3-node DB cluster
• To scale to 50K TPS: increase partitions + pods (Kafka scales linearly)
• DB becomes bottleneck first — shard by account range or use NewSQL

OBSERVABILITY:
• Every payment: trace ID, processing time, each service hop timed
• SLO: 99.95% success, p99 < 500ms
• Alert: error rate > 0.05% triggers PagerDuty immediately` },

    { level:"Advanced", q:"What is the Outbox pattern? Why is it essential in banking event-driven systems?",
      a:`The Outbox pattern solves the dual-write problem: how do you atomically update a database AND publish to Kafka without a distributed transaction?

THE PROBLEM:
Write to DB → crash → Kafka never gets the event (lost payment notification, lost audit record).
Write to Kafka first → crash → DB never gets updated (event published for a payment not recorded).

THE SOLUTION:
1. In the same DB transaction as business logic, write event to an OUTBOX table
2. A relay process reads the outbox and publishes to Kafka
3. Mark published (or delete)

The outbox write is part of the local ACID transaction — atomically guaranteed with the business data.

BEGIN TRANSACTION
  INSERT INTO payments (id, amount, status) VALUES (...)
  INSERT INTO outbox (event_type, payload, created_at, published) 
    VALUES ('PAYMENT_CREATED', '{"id":...}', NOW(), false)
COMMIT

Relay process (two approaches):
POLLING: SELECT * FROM outbox WHERE published=false ORDER BY created_at LIMIT 100 — simple but adds DB load
CDC with Debezium: reads PostgreSQL WAL (write-ahead log) directly — zero-lag, no extra DB queries, preferred at scale

Idempotency in relay:
• Relay may publish then crash before marking published
• On restart: re-publishes same event → Kafka consumers must handle duplicates
• Consumers use idempotency key from event payload to deduplicate

WHY ESSENTIAL IN BANKING:
• RBI requires guaranteed audit trails — no financial event can be silently lost
• Outbox guarantees: if the payment is in the DB, the downstream event will eventually be published
• No distributed transaction needed — just local ACID + reliable relay
• Used by HDFC, ICICI, and most modern fintech platforms` },

    { level:"Advanced", q:"How do you design a system for real-time account balance with high read throughput?",
      a:`Account balance reads are the most frequent operation in banking — every transaction check, every login shows balance, every payment validation reads balance.

CHALLENGE: balance must be accurate (strongly consistent for writes) but reads must be fast (sub-10ms).

APPROACH 1 — CACHED BALANCE (recommended):
• Maintain a running balance field in the accounts table
• Each transaction: UPDATE accounts SET balance = balance - amount WHERE id = ? (atomic, database-level)
• Cache balance in Redis with short TTL (5-30 seconds) — key: balance:{accountId}
• Read path: Redis hit → return in < 1ms. Miss → DB read → populate cache → return
• Invalidation: after any transaction commit, invalidate Redis key for that account

Why not derive from transaction sum?
• SELECT SUM(amount) FROM transactions WHERE account_id = ? is expensive at millions of rows
• Cached balance + transaction log is the hybrid used by every major bank

APPROACH 2 — READ REPLICAS:
• Primary DB handles all writes
• 2-3 read replicas handle balance queries
• Replication lag: typically < 100ms — acceptable for most balance displays
• Use sticky reads for post-transaction display (read from primary immediately after write)

APPROACH 3 — CQRS:
• Write model: PostgreSQL (ACID, transactional)
• Read model: Redis or Elasticsearch (pre-projected balance view)
• Event from write model updates read model async
• Caveat: post-transaction balance must come from write model response directly — don't re-query read model immediately

HANDLING CONCURRENT UPDATES:
• Pessimistic: SELECT FOR UPDATE — locks the row during transaction. Simple, serialises updates.
• Optimistic: version field. Compare-and-swap: UPDATE accounts SET balance=new, version=v+1 WHERE id=? AND version=v. Retry on conflict.
• Optimistic is better for high concurrency — no lock contention unless actual conflict

AT SCALE (10K TPS):
• Redis cluster: handles 100K+ balance reads/second
• Invalidation on write: after commit, publish invalidation event to Redis — all gateway instances invalidate their local cache too
• Hot accounts (large corporate accounts with many concurrent transactions): use database-level locking only, skip cache` },

    { level:"Advanced", q:"Explain database connection pooling. How do you tune it for a banking application?",
      a:`Connection pooling maintains a pre-created set of database connections that services reuse, avoiding the expensive overhead of creating a new connection per request.

WHY IT MATTERS:
Creating a DB connection: TCP handshake + authentication + session setup = 20-100ms
A request needing a connection from pool: < 1ms
At 1,000 requests/second, the difference is catastrophic without pooling.

COMPONENTS:
• Min pool size: connections always kept open even at low traffic
• Max pool size: maximum concurrent connections to DB
• Connection timeout: how long to wait for a free connection before failing
• Idle timeout: close connections idle longer than N seconds
• Max lifetime: recycle connections after N minutes (prevents stale connections)

SIZING FOR BANKING:
PostgreSQL guideline: max_connections ≈ (num_cores × 2) + effective_disk_spindles
For a 16-core DB server: max_connections ≈ 36
With 3 app pods each needing a pool: pool size per pod = 36/3 = 12

PgBouncer (connection pooler for PostgreSQL):
• Sits between app and PostgreSQL
• App maintains connections to PgBouncer (cheap)
• PgBouncer maintains smaller pool to actual PostgreSQL (expensive)
• Transaction mode: connection returned to pool after each transaction (not each request) — maximises efficiency
• Caveat: transaction mode incompatible with SET LOCAL, advisory locks — know your use cases

TUNING SIGNALS:
• Pool exhaustion (waiting for connection): pool too small OR queries too slow OR connection leak
• "connection pool exhausted" errors in logs — immediate alarm
• DB CPU low but app latency high → likely pool exhaustion
• Check: SELECT count(*) FROM pg_stat_activity — how many active connections?

COMMON MISTAKE:
Setting pool size too large. More connections ≠ faster DB. DB has context switching overhead per connection. At some point, more connections hurt throughput. Profile under realistic load, don't guess.

MONITORING:
• Active connections vs pool size (should never be at 100% for extended periods)
• Connection wait time (p99 should be < 5ms)
• Connection errors (should be 0)` },

    { level:"Advanced", q:"What is a bulkhead pattern? How does it apply to banking microservices?",
      a:`The bulkhead pattern isolates components so a failure in one doesn't cascade and exhaust resources shared by others. Named after ship compartments — a breach floods one compartment, not the whole ship.

THE PROBLEM WITHOUT BULKHEADS:
Payment service uses a shared thread pool of 200 threads for ALL downstream calls. Fraud service becomes slow. Fraud calls hold threads. Soon all 200 threads are waiting on fraud service. Payment service completely stops — even requests that don't need fraud checking are affected.

BULKHEAD SOLUTION — Separate thread pools per dependency:

Thread pool A (50 threads): fraud detection calls
Thread pool B (100 threads): account service calls
Thread pool C (50 threads): notification calls

If fraud service goes slow → pool A exhausts → fraud calls fail fast (circuit breaks)
Account calls unaffected — pool B still has 100 threads
Payment flow continues without fraud checks (fail-open strategy, with flagging)

IMPLEMENTATION in Java with Resilience4j:
Bulkhead.of("fraud-service", BulkheadConfig.custom()
  .maxConcurrentCalls(50)
  .maxWaitDuration(Duration.ofMillis(100))
  .build());

SEMAPHORE BULKHEAD vs THREAD POOL BULKHEAD:
• Semaphore: limits concurrent calls but uses caller's thread — simpler, less overhead
• Thread pool: completely separate threads — true isolation but more memory overhead
• Banking: use thread pool bulkhead for external service calls (true isolation); semaphore for lighter-weight in-process limits

CONNECTION POOL BULKHEADS:
• Separate DB connection pools per service type: critical path vs batch jobs
• Batch reconciliation job should not exhaust connections needed for real-time payments
• In Spring/HikariCP: create multiple DataSource beans with separate pools

KUBERNETES RESOURCE ISOLATION:
• Bulkhead at infrastructure level: separate node pools for critical payment services vs analytics
• Resource limits per pod: CPU throttling rather than starvation
• Namespace-level resource quotas` },

    { level:"Advanced", q:"How do you approach designing for failure in a banking system?",
      a:`Designing for failure means assuming every component WILL fail and building the system to handle failures gracefully, not just hoping they won't happen.

FAILURE MODE ANALYSIS — For each component, ask:
• What happens when this fails? (failure mode)
• How does the rest of the system behave? (impact)
• How do we detect it? (observability)
• How do we recover? (remediation)
• Can we prevent propagation? (isolation)

KEY PATTERNS:

1. TIMEOUTS EVERYWHERE
No call without a timeout. Default: never. Every external call — DB, API, cache — has a configured timeout. Without timeouts, a slow dependency holds threads forever.
Banking timeouts:
• DB query: 5 seconds max for OLTP, longer for reporting
• External payment network (NPCI): 30 seconds max
• Internal service calls: 500ms

2. RETRIES WITH BACKOFF
Retry transient failures but not permanent ones. Distinguish:
• Transient: network glitch, temporary overload (retry)
• Permanent: invalid account, insufficient funds (don't retry)
Exponential backoff + jitter: wait = min(2^attempt × 100ms + random(0,100ms), 30s)
Jitter prevents retry storms — all failing clients retrying simultaneously.

3. GRACEFUL DEGRADATION
Define what "degraded but functional" means per feature:
• Fraud check down → allow transaction but flag for manual review
• Notification service down → payment succeeds, notification queued for retry
• Rate display service down → show cached rates with staleness indicator
Never degrade silently — always indicate to user that something is degraded.

4. CHAOS ENGINEERING
Deliberately inject failures in staging/production (carefully) to validate failure handling:
• Kill a random pod → does load balancer reroute within 10 seconds?
• Introduce 500ms latency to account service → does circuit breaker trip?
• Fill disk on one DB node → does failover complete within RTO?
Netflix Chaos Monkey approach, adapted conservatively for banking.

5. DOCUMENTED RUNBOOKS
Every alert has a runbook: what is this alert, what does it mean, what are the steps to diagnose and fix? On-call engineers shouldn't be solving novel problems at 3 AM — they should be following a proven process.` },

    { level:"Advanced", q:"What is a dead letter queue and how do you use it in banking Kafka pipelines?",
      a:`A Dead Letter Queue (DLQ) is where messages go when they cannot be processed successfully after maximum retry attempts. Without a DLQ, failed messages either block the queue or are silently dropped — both catastrophic in banking.

WHY MESSAGES FAIL:
• Deserialization error: message schema changed, consumer can't parse it
• Business validation: payment references a closed account
• Downstream service error: DB unavailable during processing
• Poison pill: malformed message that always causes consumer crash

DLQ DESIGN FOR KAFKA:

STRUCTURE:
• Main topic: payment.transactions
• Retry topic: payment.transactions.retry (with increasing delay via headers)
• DLQ topic: payment.transactions.dlq

RETRY STRATEGY (exponential backoff):
1st failure → wait 1 min → retry topic
2nd failure → wait 5 min → retry topic
3rd failure → wait 30 min → retry topic
4th failure → move to DLQ

Each retry topic message includes:
• Original payload
• Error reason
• Retry count
• Original timestamp
• Last failure timestamp

DLQ CONSUMER:
• Separate consumer group reads DLQ
• Logs to operations dashboard for manual review
• Sends alert to operations team
• For critical payment failures: pages on-call engineer immediately

ENRICHED DLQ RECORD:
{
  "originalTopic": "payment.transactions",
  "originalPartition": 12,
  "originalOffset": 450123,
  "payload": {...},
  "failureReason": "Account 12345 not found",
  "retryCount": 3,
  "firstFailureAt": "2024-01-15T14:23:00Z",
  "lastFailureAt": "2024-01-15T15:05:00Z"
}

REPROCESSING FROM DLQ:
• Fix the root cause first (the closed account issue, the schema mismatch)
• Replay DLQ messages back to main topic
• Make replay idempotent — messages may partially processed before failure

MONITORING:
• DLQ message count trending up → something systemic is broken
• Alert immediately if any payment message reaches DLQ
• SLA: all DLQ items reviewed within 2 hours, resolved within 8 hours` },

    // EXPERT
    { level:"Expert", q:"How would you design a globally consistent ledger for a multi-region banking system?",
      a:`Core challenge: ledgers require strict consistency (no money created or destroyed) but multi-region means network latency and partition risk.

OPTION 1 — SINGLE REGION PRIMARY with DR replica:
• Primary ledger: Mumbai region (RBI data localisation compliant)
• Synchronous replica: Chennai (DR, RPO = 0 seconds)
• All writes to primary; reads can use replica with strong consistency option
• Failover: manual or automated (Patroni for PostgreSQL)
• Pros: Simple consistency model, regulatory compliant
• Cons: Primary region outage → failover time (RTO 2-5 minutes), Mumbai-centric latency for other regions

OPTION 2 — DISTRIBUTED SQL (CockroachDB/YugabyteDB):
• Raft consensus across 3 regions (Mumbai, Chennai, Hyderabad)
• Serialisable isolation globally — true ACID across regions
• Automatic failover, zero manual intervention
• Write latency: 100-150ms cross-region (unavoidable — speed of light)
• Follower reads for eventual consistency on dashboards
• Pros: True HA, automatic failover, ACID globally
• Cons: Higher ops complexity, licensing cost, 150ms write latency

OPTION 3 — ACCOUNT OWNERSHIP MODEL (most practical for India):
• Each account is "owned" by one region — all writes for that account go to its home region
• Cross-region transfers use Saga: debit in Region A, credit in Region B (two-phase, eventual)
• Each regional ledger is locally ACID; cross-region is eventually consistent
• Reconciliation job: verify cross-region balances every 60 seconds
• Pros: Low write latency, RBI compliant, proven pattern (HDFC, ICICI use this conceptually)
• Cons: Cross-region transfer is eventually consistent during Saga execution

IMMUTABILITY GUARANTEE (all options):
• Ledger is append-only — entries never updated or deleted
• Balance = running total maintained atomically, derived from event log
• Cryptographic hash chain: each entry includes hash of previous entry — tampering detectable
• HSM-signed entries for regulatory proof of integrity

MY RECOMMENDATION for Indian corporate banking:
Option 3 with Option 1 as DR. For greenfield platforms: Option 2 if budget allows. Account ownership model is pragmatic, RBI data localisation friendly, and proven at Indian banking scale.` },

    { level:"Expert", q:"Design a system to handle regulatory reporting for RBI in real-time.",
      a:`RBI requires banks to submit various regulatory reports — daily, weekly, monthly — some in real-time (cyber fraud within 6 hours, suspicious transactions via FIU-IND).

ARCHITECTURE:

DATA SOURCING:
• All financial events published to Kafka (from Outbox pattern)
• Regulatory reporting consumer group subscribes to all relevant topics
• Event types: payments, account changes, cash transactions > ₹10L, international transfers

REAL-TIME PIPELINE (for immediate reporting):
• Kafka Streams or Apache Flink for real-time aggregation
• Fraud incident detected → within 15 minutes, auto-generate CSITE report format
• Suspicious transaction (STR criteria met) → FIU-IND report queued within 1 hour

BATCH PIPELINE (for scheduled reports):
• Daily: CRR, SLR position, liquidity ratios → Apache Spark job at 11 PM
• Weekly: capital adequacy ratios
• Monthly: Form A, Form B submissions
• Spark reads from data warehouse (not production DB) — never put regulatory reporting load on transactional systems

REGULATORY DATA WAREHOUSE:
• Separate from transactional DB — populated via CDC from production
• Immutable — append-only, data never modified
• Retained for minimum 8 years (RBI mandate)
• Separate access controls — auditor access without production DB access

REPORT GENERATION:
• Template engine for report formats (RBI specifies exact XML/CSV formats)
• Validation layer: check completeness, referential integrity before submission
• Digital signature using DSC (Digital Signature Certificate) — mandatory for many RBI submissions

SUBMISSION TRACKING:
• Every submission logged with: report type, period, submission timestamp, RBI acknowledgement number
• Retry on submission failure with exponential backoff
• Alert if submission is at risk of missing deadline (file > 80% of SLA elapsed without acknowledgement)

AUDIT TRAIL:
• Every data point in every report traceable to source transaction
• "What transactions made up this figure?" must be answerable for any regulator query
• Immutable audit log linking report submissions to source data

FAILURE HANDLING:
• If primary pipeline fails: standby pipeline on different infrastructure (different AZ)
• Manual override capability: compliance team can manually trigger report from data warehouse
• Never miss a submission — penalty for late/missing RBI report is severe` },

    { level:"Expert", q:"How do you design a zero-downtime database migration for a critical banking table with 500 million rows?",
      a:`500 million rows means: any naive migration approach will lock the table for hours — completely unacceptable for banking.

CONSTRAINTS:
• Table must be available 24/7
• Payments writing to it continuously
• Migration must be reversible
• Zero tolerance for data loss

APPROACH — EXPAND-CONTRACT with shadow table:

PHASE 1 — PREPARE (zero risk, no downtime):
• Add new column as nullable: ALTER TABLE payments ADD COLUMN new_field VARCHAR(50) — instant in PostgreSQL (no table rewrite)
• Deploy new code that writes to BOTH old and new columns
• Old code still only reads old column — completely unaffected

PHASE 2 — BACKFILL (risk: performance, not availability):
• Backfill historical data in micro-batches:
  UPDATE payments SET new_field = derive(old_field) 
  WHERE id BETWEEN batch_start AND batch_end AND new_field IS NULL
• Batch size: 1,000-5,000 rows max — hold table lock for milliseconds, not minutes
• Sleep 100ms between batches — prevents overwhelming the DB
• Run during off-peak hours, monitor replication lag and I/O during execution
• At 5,000 rows/batch with 100ms sleep: 500M rows = 100,000 batches = ~3 hours

PHASE 3 — SWITCH (coordinated, low-risk):
• Once backfill complete and verified: deploy code reading from new column only
• Wait for all pods to use new code (rolling deployment, 10-15 minutes)
• Add NOT NULL constraint (if needed): ALTER TABLE payments ALTER COLUMN new_field SET NOT NULL — fast because no nulls exist

PHASE 4 — CONTRACT (irreversible — do last):
• Once stable (1-2 weeks): drop old column
• Test that no code references old column (grep, integration tests)
• Monitor for 48 hours post-drop before calling done

FOR INDEX ADDITION on 500M rows:
• CREATE INDEX CONCURRENTLY new_idx ON payments(status, created_at) — no table lock, runs in background
• Takes hours but doesn't block reads or writes
• Monitor: SELECT phase, blocks_done, blocks_total FROM pg_stat_progress_create_index

NEVER DO:
• ALTER TABLE with locking operations during business hours
• Adding NOT NULL without default in one step — table rewrite = full lock
• Running un-batched UPDATE on full table — holds lock, kills payment writes
• Deploying new schema and new code simultaneously — always schema first, code second

VALIDATION:
• Before phase 4: run parallel queries comparing old and new field values — verify 100% match
• Shadow read: 1% of reads from new column, compare to old column in application — alert on mismatch
• Only drop old column when shadow read shows 0 discrepancies for 48 continuous hours` },

    { level:"Expert", q:"What is eventual consistency in distributed banking systems and how do you manage the risks?",
      a:`Eventual consistency is a consistency model where, given no new updates, all replicas converge to the same value — but during propagation, different nodes may return different values.

WHY IT EXISTS IN BANKING:
Strong consistency across distributed nodes requires coordination (quorum writes, consensus protocols) — this adds latency (100-300ms cross-region). For some operations, this latency is unacceptable, so eventual consistency is an explicit design choice.

WHERE IT APPEARS AND HOW TO MANAGE:

READ REPLICAS:
• Replication lag: writes to primary appear on replica within 10ms-2 seconds
• Risk: customer sees old balance immediately after transaction
• Mitigation: "read-your-writes" consistency — after a write, read from primary for that session for next 5 seconds. Subsequent reads can use replica.

CQRS READ MODELS:
• Write model updated synchronously; read model updated via events asynchronously
• Risk: balance shown in dashboard slightly stale
• Mitigation: return new balance directly in the write API response. Client displays it immediately without re-querying the read model. Read model catches up in background.

CROSS-REGION SAGA:
• Transfer: debit in Region A committed, credit in Region B in progress
• Risk: source account shows debit, destination hasn't been credited yet
• Mitigation: "in-flight" transaction status visible to both parties. Clear UX: "Transfer initiated, will complete in <30 seconds." Never show money as "gone" from source without showing status.

KAFKA CONSUMER LAG:
• Events published to Kafka but downstream consumer is behind
• Risk: fraud detection service 2 minutes behind — misses real-time fraud signal
• Mitigation: consumer lag monitoring with alert threshold. For real-time fraud: synchronous rule check in transaction path; ML score via async consumer is supplementary.

CONFLICT RESOLUTION:
When two regions have conflicting updates (split-brain scenario):
• Last-write-wins: latest timestamp wins — risk of losing valid data
• Application-level resolution: business rules decide (e.g., lower balance wins for safety)
• Human resolution queue: conflicting records flagged for ops team
• Banking standard: design to avoid conflicts (account ownership model) rather than resolve them

KEY PRINCIPLE:
Never choose eventual consistency without explicitly defining:
1. Maximum acceptable lag
2. User experience during inconsistency
3. How to detect and alert when lag exceeds threshold
4. Reconciliation process to detect and fix any data divergence` },

    { level:"Expert", q:"How would you architect a banking platform for regulatory compliance across multiple jurisdictions?",
      a:`Multi-jurisdiction banking (operating in India, UAE, Singapore, etc.) creates complex compliance architecture requirements — each jurisdiction has different data residency, reporting, and operational requirements.

CORE PRINCIPLES:

1. DATA SOVEREIGNTY BY DESIGN:
• Each jurisdiction's customer data stays in that jurisdiction's infrastructure
• Indian customers: data in Indian data centres (RBI mandate)
• UAE customers: data in UAE data centres (CBUAE requirements)
• No cross-border data flow of PII without explicit regulatory approval
• Architecture: jurisdiction-isolated database clusters, jurisdiction-tagged data at creation time

2. COMPLIANCE AS CODE:
• Regulatory rules encoded as executable policy, not documents
• Open Policy Agent (OPA) or custom rule engine: evaluate every transaction against applicable rules
• Rules versioned in git — changes tracked, audited, peer-reviewed
• Automated compliance test suite: regulatory rule changes trigger test suite execution

3. SHARED SERVICES vs JURISDICTION-SPECIFIC:
Shared (jurisdiction-agnostic):
• Authentication infrastructure (identity, tokens — no PII stored)
• Monitoring and alerting platform
• CI/CD pipeline
• Internal developer tools

Jurisdiction-specific:
• Customer databases and transaction records
• Regulatory reporting pipelines
• KYC data and processes
• Audit logs (retained per local jurisdiction requirements)

4. REPORTING ARCHITECTURE:
• Each jurisdiction has its own regulatory reporting pipeline
• India: RBI CSITE, FIU-IND, NPCI feeds
• UAE: CBUAE reporting, goAML for AML
• Data never leaves the jurisdiction for reporting — all report generation is local
• Central compliance dashboard aggregates compliance status (not data) across jurisdictions

5. ENCRYPTION AND KEY MANAGEMENT:
• Jurisdiction-specific KMS: Indian customer data encrypted with keys managed in India (AWS KMS with India region, or on-prem HSM)
• Cross-jurisdiction key access: prohibited — technical enforcement, not just policy
• Key custody: aligned with local regulatory requirements

6. AUDIT REQUIREMENTS:
• India: 8 years (RBI)
• UAE: 5 years (CBUAE)
• Each jurisdiction retains its own audit logs for required period
• Audit log format aligned to each regulator's inspection requirements

7. INCIDENT RESPONSE:
• Jurisdiction-specific incident response plans (different regulators, different timelines)
• India CSITE: cyber incident report within 6 hours
• UAE: CBUAE notification within 2 hours for critical incidents
• Automated incident detection system knows which jurisdiction is affected and routes to correct reporting workflow` },
  ]
};

const DOMAIN_DB = {
  id: "db", title: "Database & Transactions", icon: "🗄️", color: "#a855f7",
  qa: [
    { level:"Basic", q:"What are ACID properties? Give a banking example for each.",
      a:`ATOMICITY — All operations in a transaction succeed or none do.
Example: Transfer ₹10,000 from Account A to B. Debit A and credit B must both happen or neither. Server crash after debit but before credit → full rollback. No money disappears.

CONSISTENCY — Transaction brings DB from one valid state to another. All constraints hold.
Example: Balance ≥ 0 constraint. Transaction attempting to take balance below zero violates consistency and is rejected.

ISOLATION — Concurrent transactions execute as if sequential. No transaction sees another's intermediate state.
Example: Two ATM withdrawals simultaneously from same account. Both cannot see the full balance and both succeed — isolation prevents this phantom.

DURABILITY — Committed transactions persist even if system crashes immediately after.
Example: Payment confirmation shown to customer. Server crashes 1ms later. On restart, the transaction is still committed. Achieved via Write-Ahead Logging (WAL) — changes written to durable log before applying to data files.

Interview tip: Connect each property to a specific failure mode it prevents. ACID without examples sounds theoretical — examples show you understand what breaks without it.` },

    { level:"Basic", q:"What is an index in a database? When should you add one in banking?",
      a:`An index is a data structure (usually B-tree) that allows the database to find rows matching a condition without scanning every row. Like a book index — jump directly to the relevant page.

Without index: SELECT * FROM transactions WHERE account_id = 12345 → full table scan. At 500M rows, this takes minutes.
With index on account_id: B-tree lookup → find matching rows in milliseconds.

Types:
• B-tree index: default, good for equality (=) and range (>, <, BETWEEN) queries
• Hash index: only equality — slightly faster for exact match, no range queries
• Composite index: index on multiple columns — (account_id, created_at) speeds up queries filtering by both
• Partial index: index on subset of rows — WHERE status='PENDING' for frequently queried pending transactions

When to ADD in banking:
• Any column used in WHERE clause of frequent queries
• Foreign keys (account_id in transactions table) — essential, often forgotten
• Columns used in ORDER BY and GROUP BY on large tables
• Composite: if you always filter by (status, created_date) together

When NOT to add:
• Small tables (< 10K rows) — full scan is fine
• Columns with very low cardinality (e.g., a "yes/no" flag — index rarely helps)
• Too many indexes on write-heavy tables (transactions) — every write must update all indexes, slowing writes

Monitoring: pg_stat_user_indexes shows index usage. Unused indexes just slow writes — remove them.` },

    { level:"Basic", q:"What is the difference between DELETE, TRUNCATE, and DROP in SQL?",
      a:`DELETE: removes rows matching WHERE clause. Logged (each deleted row logged in WAL). Can be rolled back. Triggers fire. Slow on large datasets.
DELETE FROM transactions WHERE status='CANCELLED' AND created_at < '2020-01-01';

TRUNCATE: removes ALL rows. Minimally logged (faster). Cannot use WHERE clause. Can be rolled back in PostgreSQL (DDL transaction). Triggers do NOT fire. Much faster than DELETE for full table clear.
TRUNCATE TABLE temp_reconciliation_staging;

DROP: removes the entire table structure. Irreversible without backup. Removes data, indexes, constraints, everything.
DROP TABLE temp_staging;

Banking context:
• DELETE: used in data retention jobs — delete specific old records based on criteria
• TRUNCATE: clearing staging/temp tables between reconciliation runs
• DROP: almost never in production banking systems; only in controlled migration scripts with explicit approval

Critical: Never run DELETE or TRUNCATE on core banking tables (transactions, accounts, ledger) without explicit compliance sign-off — even for "old" data. RBI requires retention for 8+ years. DELETE for compliance disposal must be logged and approved.` },

    { level:"Basic", q:"What is a foreign key constraint? Why is it sometimes avoided in banking systems?",
      a:`A foreign key constraint ensures referential integrity — a value in one table must exist in the referenced table.

Example: transactions.account_id MUST exist in accounts.id
ALTER TABLE transactions ADD CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id);

Benefits:
• Prevents orphaned records (transaction with no parent account)
• Enforces data integrity at DB level — not just application level
• Self-documenting schema

WHY SOMETIMES AVOIDED in high-volume banking:

PERFORMANCE:
• Every INSERT to transactions requires a lookup in accounts to verify the account exists
• Every DELETE from accounts requires checking no transactions reference it
• At 10,000 TPS on transactions table: 10,000 FK validations/second adds meaningful overhead

SHARDING AND PARTITIONING:
• If accounts and transactions are on different DB shards, FK constraints can't span shards
• Distributed databases often don't support cross-shard FKs

MICROSERVICES:
• transactions service and accounts service may have separate databases
• FK constraints can't cross service boundaries
• Referential integrity enforced at application level instead

THE PRAGMATIC APPROACH:
• Application-level validation: always check account exists before inserting transaction
• Soft FK: store account_id but no DB constraint — application enforces
• Compensating checks: reconciliation jobs detect orphaned records
• Never skip validation entirely — just move it from DB to application layer with the same rigour` },

    { level:"Basic", q:"What is database normalisation? When do you denormalise in banking?",
      a:`Normalisation organises data to reduce redundancy and improve integrity through normal forms (1NF, 2NF, 3NF, BCNF).

Example of denormalised (bad for writes):
transactions table: account_id, account_holder_name, account_branch, amount, date
(account_holder_name and account_branch repeated for every transaction)

Normalised:
accounts: account_id, holder_name, branch_id
transactions: transaction_id, account_id (FK), amount, date

Benefits of normalisation:
• Update account holder name in ONE place
• No inconsistency (can't have two different names for same account)
• Less storage
• Better write performance

WHEN TO DENORMALISE in banking:

REPORTING AND ANALYTICS:
• Joins across 5-6 tables are expensive for generating monthly statements
• Statement generation table: pre-joined, denormalised view of transaction + account + product info
• Materialised views or separate reporting tables with denormalised data

READ MODELS IN CQRS:
• Account dashboard: pre-computed, denormalised view optimised for fast read
• Contains account balance, last 5 transactions, product name — all in one record
• Updated asynchronously from write model events

AUDIT LOGS:
• Deliberately denormalised — capture everything at point-in-time
• Even if account holder name changes later, audit log preserves original name at transaction time
• "What was the account holder's name when this transaction occurred?" is a valid compliance question

Rule: normalise the write model (transactional tables), denormalise the read model (reporting, audit, dashboard).` },

    // INTERMEDIATE DB
    { level:"Intermediate", q:"Explain database isolation levels with banking examples for each anomaly.",
      a:`Isolation levels control how much a transaction is exposed to concurrent transactions.

READ UNCOMMITTED (weakest):
• Can read uncommitted changes from other transactions (DIRTY READ)
• Banking example: Transaction A debits ₹5,000. Transaction B reads the debit (balance reduced). Transaction A rolls back. B now has incorrect data.
• NEVER use in banking.

READ COMMITTED:
• Only reads committed data. No dirty reads.
• NON-REPEATABLE READ possible: same row read twice may return different values within one transaction.
• Banking example: Report transaction reads account balance: ₹50,000. Another transaction commits a debit. Report reads balance again: ₹45,000. Inconsistency within same report run.
• Use for: display queries where slight inconsistency is acceptable (dashboard metrics)

REPEATABLE READ:
• Same row read twice always returns same value within transaction.
• PHANTOM READ possible: new rows matching WHERE clause can appear on second read.
• Banking example: SELECT all transactions WHERE amount > 100000 returns 5. Another transaction commits a new large transaction. Re-read returns 6 — a phantom appeared.
• MySQL InnoDB default. Use for: generating account statements within a transaction.

SERIALISABLE (strongest):
• Transactions execute as if sequential. Prevents all anomalies including phantoms.
• Highest consistency, highest locking overhead.
• Banking use: ALL financial writes (debits, credits, transfers). Non-negotiable.
• PostgreSQL uses SSI (Serialisable Snapshot Isolation) — avoids most locking overhead while providing serialisability.

CHOOSING in practice:
• All writes: SERIALISABLE
• Account statement generation: REPEATABLE READ
• Balance display for dashboard: READ COMMITTED
• Analytical queries on historical data: READ COMMITTED or snapshot isolation` },

    { level:"Intermediate", q:"What is a database deadlock? How do you prevent it in banking applications?",
      a:`A deadlock occurs when two transactions each hold a lock the other needs, and both wait indefinitely.

CLASSIC BANKING DEADLOCK:
Transaction A: Transfer ₹1,000 from Account 1 to Account 2
• Acquires lock on Account 1 (to debit)
• Tries to acquire lock on Account 2 (to credit) — waits

Transaction B: Transfer ₹500 from Account 2 to Account 1 (simultaneously)
• Acquires lock on Account 2 (to debit)
• Tries to acquire lock on Account 1 (to credit) — waits

Result: A waits for B to release Account 2. B waits for A to release Account 1. Deadlock.

Database detection: PostgreSQL detects deadlocks automatically, aborts one transaction (the "victim"), and returns a deadlock error. The aborted transaction must be retried.

PREVENTION STRATEGIES:

1. CONSISTENT LOCK ORDERING (most effective):
Always lock accounts in the same order — e.g., always lock lower account_id first:
if (from_account_id < to_account_id):
  lock(from_account_id), then lock(to_account_id)
else:
  lock(to_account_id), then lock(from_account_id)
Both transactions A and B now acquire locks in the same order → no circular wait.

2. LOCK TIMEOUT:
SET lock_timeout = '5s'; — transaction fails rather than waiting indefinitely.
Application retries with exponential backoff.

3. OPTIMISTIC LOCKING:
Use version field. No locks acquired — compare-and-swap on commit.
UPDATE accounts SET balance=new_balance, version=v+1 WHERE id=? AND version=v
If version mismatch (concurrent update): retry transaction.
Best for read-heavy workloads with rare conflicts.

4. SELECT FOR UPDATE NOWAIT:
Lock immediately or fail instantly (don't wait).
SELECT * FROM accounts WHERE id=? FOR UPDATE NOWAIT;
Instant failure → instant retry → no waiting chain to form deadlocks.

MONITORING: pg_locks and pg_stat_activity show current locks. Deadlock errors in application logs should alert (> 0 per minute is a signal).` },

    { level:"Intermediate", q:"What is CQRS and how do you implement it for a banking account service?",
      a:`CQRS (Command Query Responsibility Segregation) separates the write model (Commands) from the read model (Queries). Different data stores optimised for each.

WHY in banking:
• Write model needs: ACID, strong consistency, normalised schema
• Read model needs: denormalised, fast, flexible — account dashboard joins 5+ tables
• Combining both into one forces compromises hurting both

IMPLEMENTATION:

COMMAND SIDE (writes):
Commands: CreateAccount, Deposit, Withdraw, Transfer
→ Write to PostgreSQL (normalised, full ACID)
→ After commit: publish AccountEvent to Kafka
→ Command handlers synchronous — client waits for ack

QUERY SIDE (reads):
Event consumers build read models from Kafka events:
• Redis: current balance, account summary (sub-ms reads)
• Elasticsearch: transaction history, full-text search, statements
• PostgreSQL read replica: complex compliance reports, SQL-based analytics

FLOW:
Customer checks balance → Redis (< 1ms)
Customer views transactions → Elasticsearch (fast search)
Compliance generates report → PostgreSQL replica (full SQL)

CONSISTENCY HANDLING (the tricky part):
After a transfer, write model succeeds immediately.
Read model updates within 100-500ms (async).
User immediately re-queries balance → might see stale data.

Solution: Return the NEW balance directly in the command API response.
POST /transfers → response includes new_balance: 45000
Client displays it immediately without re-querying.
Don't make client re-fetch from the eventually-consistent read model right after a write.

EVENT SOURCING pairs naturally with CQRS:
Store events instead of current state.
Balance = sum of all Deposit and Withdraw events.
Built-in full audit trail — zero extra code.
Can rebuild any read model from scratch by replaying events.
Trade-off: rebuilding takes time; snapshot periodically to avoid replaying millions of events.` },

    { level:"Intermediate", q:"How do you implement soft delete in a banking system?",
      a:`Soft delete marks records as deleted rather than physically removing them. Critical in banking for audit trail and regulatory compliance.

IMPLEMENTATION:

Option 1 — Boolean flag:
ALTER TABLE accounts ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE accounts ADD COLUMN deleted_at TIMESTAMP;
ALTER TABLE accounts ADD COLUMN deleted_by VARCHAR(50);

Delete operation:
UPDATE accounts SET is_deleted=true, deleted_at=NOW(), deleted_by='user_123' WHERE id=?;

Every query must include WHERE is_deleted=false — easy to forget, creates bugs.

Option 2 — Separate deleted table (better for banking):
CREATE TABLE accounts_deleted AS SELECT * FROM accounts WHERE 1=2; -- same structure
-- Add columns: deleted_at, deleted_by, deletion_reason

Delete operation:
BEGIN;
  INSERT INTO accounts_deleted SELECT *, NOW(), current_user, 'Account closure request' FROM accounts WHERE id=?;
  DELETE FROM accounts WHERE id=?;
COMMIT;

Benefits:
• Main table stays clean — no WHERE is_deleted needed
• Deleted records completely isolated — can have different retention policies
• Harder to accidentally expose deleted data

Option 3 — Status field (most common in banking):
accounts.status: ACTIVE | DORMANT | CLOSED | FROZEN
No physical delete ever.
Queries filter by status: WHERE status='ACTIVE'

WHY NO PHYSICAL DELETE IN BANKING:
• RBI mandates 8-year retention of account and transaction records
• Regulatory investigations may require records from closed accounts
• Customer disputes reference historical records
• Auditors expect complete history

INDEXES for soft delete:
Create partial index: CREATE INDEX idx_active_accounts ON accounts(id) WHERE status='ACTIVE';
Only active accounts in index — queries on active accounts fast; deleted accounts don't bloat index.` },

    { level:"Intermediate", q:"What are materialised views and when do you use them in banking?",
      a:`A materialised view stores the result of a query physically on disk. Unlike a regular view (which re-executes the query on each access), a materialised view is pre-computed and fast to read.

Regular view: SELECT * FROM account_summary_view → executes 5-table join every time → slow
Materialised view: same query, result stored → read in milliseconds → refresh periodically

CREATION:
CREATE MATERIALISED VIEW monthly_transaction_summary AS
SELECT 
  account_id,
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  SUM(CASE WHEN type='DEBIT' THEN amount ELSE 0 END) as total_debits,
  SUM(CASE WHEN type='CREDIT' THEN amount ELSE 0 END) as total_credits
FROM transactions
WHERE created_at >= NOW() - INTERVAL '13 months'
GROUP BY account_id, DATE_TRUNC('month', created_at);

REFRESH:
REFRESH MATERIALISED VIEW CONCURRENTLY monthly_transaction_summary;
-- CONCURRENTLY: allows reads during refresh (requires unique index)
-- Schedule: nightly via pg_cron or external scheduler

BANKING USE CASES:
• Monthly account statements: pre-computed aggregates for each account × month
• Dashboard KPIs: total daily transaction volume, average ticket size
• Regulatory reporting: pre-aggregated data for RBI submissions
• Branch performance reports: pre-computed rather than real-time query

WHEN NOT TO USE:
• Data that must be real-time (balance, current payment status)
• Frequently changing data where refresh overhead exceeds query savings
• Tables where REFRESH CONCURRENTLY isn't feasible (no unique index)

ALTERNATIVE — Incremental materialisation:
Instead of refreshing entire view, maintain an event-driven summary table updated by triggers or Kafka consumers. More complex but avoids full refresh cost.` },

    { level:"Intermediate", q:"Explain database partitioning. Design a partitioning strategy for a transactions table.",
      a:`Partitioning splits a large table into smaller pieces (partitions) that are stored and queried separately, while appearing as one table to the application.

Types:

RANGE PARTITIONING: partition by value range — most common for time-series data
HASH PARTITIONING: partition by hash of key — even distribution
LIST PARTITIONING: partition by discrete values (region, product type)

DESIGN for transactions table (5 billion rows, growing 10M/day):

PRIMARY STRATEGY — Range partition by month:
CREATE TABLE transactions (
  id UUID, account_id BIGINT, amount DECIMAL,
  transaction_date TIMESTAMP, status VARCHAR(20)
) PARTITION BY RANGE (transaction_date);

CREATE TABLE transactions_2024_01 PARTITION OF transactions
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE transactions_2024_02 PARTITION OF transactions
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- etc.

Benefits:
• Query for account statement (last 3 months) touches only 3 partitions, not 5 billion rows
• Regulatory data archival: move partitions older than 8 years to cold storage or archive DB
• DROP TABLE transactions_2015_01 — instant, vs DELETE which scans rows
• Indexes per partition — smaller, faster

SUB-PARTITIONING (for very high volume):
Partition by month, then sub-partition by account_id hash:
transactions_2024_01 sub-partitioned into 16 hash buckets
→ Each bucket manageable size, parallel queries use multiple buckets

PARTITION PRUNING:
Query planner eliminates irrelevant partitions automatically.
WHERE transaction_date BETWEEN '2024-01-01' AND '2024-01-31' → only scans Jan 2024 partition.
Must include partition key in WHERE for pruning to work.

OPERATIONAL BENEFITS:
• VACUUM runs per partition — smaller tables vacuum faster
• Index rebuilds on one partition don't lock other months
• Automatic archival: pg_partman extension manages partition creation/dropping automatically

GOTCHA: Queries without partition key in WHERE scan ALL partitions — potentially worse than un-partitioned. Always include transaction_date in query WHERE clauses.` },

    // ADVANCED DB
    { level:"Advanced", q:"Design a schema for a core banking ledger system.",
      a:`A core banking ledger is the financial source of truth. Every rupee in the system must be traceable to ledger entries.

DOUBLE-ENTRY DESIGN:

-- Chart of Accounts
CREATE TABLE gl_accounts (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,     -- e.g. "1001.001" 
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,            -- ASSET, LIABILITY, EQUITY, INCOME, EXPENSE
  currency CHAR(3) DEFAULT 'INR',
  is_active BOOLEAN DEFAULT TRUE,
  parent_id BIGINT REFERENCES gl_accounts(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Immutable Journal Entries (header)
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number VARCHAR(50) UNIQUE NOT NULL,  -- external reference (payment ID)
  entry_date DATE NOT NULL,
  description VARCHAR(500),
  source_system VARCHAR(50),      -- PAYMENTS, INTEREST, FEES
  posted_by VARCHAR(100),
  posted_at TIMESTAMP DEFAULT NOW(),
  reversed_by UUID REFERENCES journal_entries(id),  -- if this entry was reversed
  is_reversal BOOLEAN DEFAULT FALSE
);

-- Immutable Journal Lines (detail)
CREATE TABLE journal_lines (
  id BIGSERIAL PRIMARY KEY,
  journal_entry_id UUID NOT NULL REFERENCES journal_entries(id),
  gl_account_id BIGINT NOT NULL REFERENCES gl_accounts(id),
  debit_amount DECIMAL(18,2) DEFAULT 0,
  credit_amount DECIMAL(18,2) DEFAULT 0,
  currency CHAR(3) DEFAULT 'INR',
  narration VARCHAR(200)
);

-- Account Balances (derived, cached)
CREATE TABLE account_balances (
  gl_account_id BIGINT PRIMARY KEY REFERENCES gl_accounts(id),
  balance DECIMAL(18,2) NOT NULL DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  version BIGINT DEFAULT 0   -- optimistic locking
);

CONSTRAINTS:
• Journal lines for a journal entry must balance: SUM(debit) = SUM(credit)
• journal_entries and journal_lines are INSERT-only — no UPDATE, no DELETE
• balance update: UPDATE account_balances SET balance=balance+delta, version=version+1 WHERE gl_account_id=? AND version=current_version

AUDIT / INTEGRITY:
• Hash chain: each journal_entry stores SHA256 of (previous_hash + current_entry_data) — tamper detection
• Separate hash_chain table stores running hash — verified by nightly batch job
• Never store balance as only source of truth — always reconcilable from journal_lines sum

REPORTING:
• Trial balance: SELECT gl_account_id, SUM(debit_amount) - SUM(credit_amount) FROM journal_lines GROUP BY gl_account_id
• Balance sheet: filter by account type
• P&L: filter INCOME and EXPENSE accounts for date range` },

    { level:"Advanced", q:"What is optimistic vs pessimistic locking? Which to use in high-concurrency banking?",
      a:`PESSIMISTIC LOCKING:
Assumes conflicts will happen. Locks the resource before reading, holds lock until transaction commits.
SELECT * FROM accounts WHERE id=? FOR UPDATE; -- acquires row-level exclusive lock
Other transactions attempting to read/update this row WAIT until lock is released.

Pros: Simple. No retry logic needed. Conflict impossible while lock held.
Cons: Reduces concurrency — other transactions queue up. Deadlock risk. Bad for high-read workloads.

Banking use: Inter-account transfers where you MUST prevent concurrent modification. SELECT FOR UPDATE on both accounts, then transfer.

OPTIMISTIC LOCKING:
Assumes conflicts are rare. No lock acquired upfront. Detect conflict at commit time using version number.

accounts table has version column.
Read: SELECT id, balance, version FROM accounts WHERE id=?  -- version=5
Compute new balance in application.
Update: UPDATE accounts SET balance=new_balance, version=6 WHERE id=? AND version=5
If 0 rows updated: someone else changed it (version no longer 5) → conflict → retry
If 1 row updated: success, no conflict.

Pros: Maximum concurrency — no waiting. No deadlocks. Better throughput for read-heavy workloads.
Cons: Retry logic required. Under high contention, many retries → throughput degrades.

CHOOSING for banking:

HIGH CONTENTION (same account multiple concurrent updates — salary processing):
→ Pessimistic locking (SELECT FOR UPDATE)
→ Serialises updates, predictable behaviour

NORMAL OPERATIONS (typical payment, usually no contention on same account):
→ Optimistic locking with retry
→ Higher throughput, better scalability

HYBRID (common pattern):
Try optimistic first.
On conflict: retry up to 3 times with exponential backoff.
After 3 failures: fall back to pessimistic (SELECT FOR UPDATE).
Best of both worlds — fast path for no-contention, correct path for contention.

NEVER: hold a pessimistic lock across a network call (e.g., call fraud service while holding DB lock). Network calls can take seconds; DB lock blocks all other transactions for that account.` },

    { level:"Advanced", q:"How do you implement database auditing in a banking application?",
      a:`Database auditing records WHO did WHAT to WHICH data WHEN. Mandatory in banking — RBI requires complete audit trails for all financial operations.

LEVELS OF AUDITING:

1. APPLICATION-LEVEL AUDIT LOG (recommended primary approach):
Every write operation explicitly records an audit entry.

CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  table_name VARCHAR(100) NOT NULL,
  record_id VARCHAR(100) NOT NULL,
  operation VARCHAR(10) NOT NULL,     -- INSERT, UPDATE, DELETE
  old_values JSONB,                   -- previous state
  new_values JSONB,                   -- new state
  changed_by VARCHAR(100) NOT NULL,   -- application user (not DB user)
  changed_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  session_id VARCHAR(100),
  request_id VARCHAR(100),            -- correlates to API request / trace
  reason VARCHAR(500)                 -- business reason for change
);

Application code writes audit record in same transaction as business operation.
Benefits: captures APPLICATION user (not just DB user), includes business context, request correlation.

2. DATABASE TRIGGER APPROACH:
CREATE OR REPLACE FUNCTION audit_trigger() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (table_name, record_id, operation, old_values, new_values, changed_at)
  VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER accounts_audit AFTER INSERT OR UPDATE OR DELETE ON accounts
FOR EACH ROW EXECUTE FUNCTION audit_trigger();

Benefits: catches ALL changes, even direct DB access.
Limitation: doesn't capture application user context (only DB session user).

3. CDC (CHANGE DATA CAPTURE) with Debezium:
Reads PostgreSQL WAL → publishes all changes to Kafka → audit consumer stores to immutable audit store.
Benefits: zero impact on transactional DB, immutable (can't be modified even by DBAs), scalable.
Best for: high-volume tables where trigger overhead is a concern.

IMMUTABILITY:
Audit log must be append-only — no UPDATE or DELETE allowed.
Enforce with: revoke UPDATE, DELETE privileges from application DB user on audit_log table.
Or: write audit to a separate, locked-down database or object storage (S3 with versioning enabled).

RETENTION: minimum 8 years (RBI). Use tiered storage — hot (DB) for recent 2 years, cold (S3 Glacier or tape) for older records.` },

    { level:"Advanced", q:"What are window functions in SQL? Give banking examples.",
      a:`Window functions perform calculations across a set of rows related to the current row, without collapsing rows into groups (unlike GROUP BY).

Syntax: function() OVER (PARTITION BY ... ORDER BY ... ROWS/RANGE ...)

ROW_NUMBER — unique sequential number within partition:
SELECT 
  account_id, amount, transaction_date,
  ROW_NUMBER() OVER (PARTITION BY account_id ORDER BY transaction_date DESC) as txn_rank
FROM transactions;
-- Use: get the 3 most recent transactions per account (WHERE txn_rank <= 3)

RANK / DENSE_RANK — rank with/without gaps for ties:
SELECT merchant_id, total_amount,
  RANK() OVER (ORDER BY total_amount DESC) as merchant_rank
FROM merchant_monthly_summary WHERE month='2024-01';
-- Use: top 10 merchants by transaction volume for RBI reporting

LAG / LEAD — access previous or next row:
SELECT account_id, transaction_date, balance,
  LAG(balance) OVER (PARTITION BY account_id ORDER BY transaction_date) as previous_balance,
  balance - LAG(balance) OVER (PARTITION BY account_id ORDER BY transaction_date) as balance_change
FROM account_balance_history;
-- Use: detect unusual balance changes (potential fraud — sudden large change)

SUM (running total):
SELECT transaction_date, amount,
  SUM(amount) OVER (PARTITION BY account_id ORDER BY transaction_date 
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_balance
FROM transactions WHERE account_id=?;
-- Use: reconstruct running balance from transaction history for statement generation

PERCENTILE / NTILE:
SELECT amount,
  NTILE(4) OVER (ORDER BY amount) as quartile
FROM transactions WHERE created_at >= NOW() - INTERVAL '30 days';
-- Use: identify transactions in top quartile for fraud risk scoring

AVG (moving average):
SELECT date, daily_volume,
  AVG(daily_volume) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as weekly_avg
FROM daily_transaction_volume;
-- Use: detect anomalous days (today's volume vs 7-day average) for operations monitoring

Performance note: window functions can be expensive on large tables. Use only on appropriately filtered datasets (date ranges) or pre-aggregated reporting tables, not on raw 500M-row transaction tables.` },

    { level:"Expert", q:"Design a database strategy for a multi-tenant corporate banking platform.",
      a:`Multi-tenancy in corporate banking: one platform serving multiple banks or corporate clients, each with strict data isolation requirements.

THREE TENANCY MODELS:

MODEL 1 — DATABASE PER TENANT:
Each bank gets its own database instance.
Pros: Complete isolation, independent backup/restore, compliance per tenant, tenant-specific tuning.
Cons: Expensive (N databases × infrastructure cost), operational overhead scales linearly, schema migrations must run N times.
Use when: tenant is a regulated bank with strict data sovereignty requirements. PCI scope isolation. RBI-regulated banks may REQUIRE this.

MODEL 2 — SCHEMA PER TENANT (same DB, different schemas):
CREATE SCHEMA bank_hdfc; CREATE SCHEMA bank_icici;
Each schema has identical table structure.
search_path = 'bank_hdfc' routes all queries to that bank's schema.
Pros: Shared DB infrastructure, complete data isolation, independent schema evolution possible.
Cons: PostgreSQL allows 64 schemas practically; cross-tenant queries possible with search_path misconfiguration (security risk).
Use when: moderate number of tenants (< 50) with strong isolation needs.

MODEL 3 — ROW-LEVEL TENANCY (shared tables, tenant_id column):
All tables have tenant_id column.
Every query includes WHERE tenant_id=current_tenant (enforced by ORM/middleware).
Pros: Most efficient infrastructure use, simplest operations.
Cons: Risk of cross-tenant data exposure if tenant_id filter missed. RLS (Row Level Security) in PostgreSQL mitigates this.
Use when: SaaS-style deployment, many small tenants, data isolation via RLS enforcement.

RECOMMENDED HYBRID for corporate banking:
• Tier 1 (large regulated banks): Database per tenant
• Tier 2 (medium corporates): Schema per tenant
• Tier 3 (small corporates): Row-level with RLS

ROW LEVEL SECURITY (RLS) for Tier 3:
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON transactions
  USING (tenant_id = current_setting('app.current_tenant')::BIGINT);
-- Now every SELECT/INSERT/UPDATE/DELETE automatically filters by tenant
-- Even if application forgets WHERE tenant_id=?, RLS enforces it

CROSS-TENANT OPERATIONS (admin/reporting):
• Separate admin role with RLS bypass: SET app.bypass_rls=true (strictly controlled)
• Separate admin DB user: BYPASSRLS privilege — used only by internal reporting service
• Never expose to application user

MIGRATION STRATEGY:
• Schema per tenant: migrate each schema sequentially with Flyway tenant-aware runner
• Row-level: single migration — all tenants simultaneously (risky for large schema changes — use expand-contract)
• Database per tenant: orchestration tool runs migration across all tenant DBs` },

    { level:"Expert", q:"What are the trade-offs between using UUIDs vs sequential IDs in banking systems?",
      a:`SEQUENTIAL IDs (BIGSERIAL/AUTO_INCREMENT):
Generated by DB, always increasing.

PROS:
• Smaller storage: 8 bytes vs 16 bytes UUID
• B-tree index efficiency: sequential inserts go to end of index — no page splits, no fragmentation
• Readable: easy to reference in support tickets ("transaction ID 45231")
• Natural ordering: sort by ID = sort by creation time

CONS:
• Predictable: IDs 1, 2, 3, 4 — attacker can enumerate records (GET /transactions/5 when you have access to /transactions/4)
• Distributed generation problem: auto-increment requires a central source of truth. In distributed systems, multiple DB shards can't independently generate sequential IDs without coordination.
• Merge conflicts: combining data from two systems with overlapping sequential IDs creates collisions.

UUIDs (v4 random):
128-bit random identifier: 550e8400-e29b-41d4-a716-446655440000

PROS:
• No central coordination needed — any service can generate a UUID independently
• Non-guessable — security by obscurity (small benefit, but real)
• Merge-safe: combining datasets from different systems — no collisions
• Client-generated idempotency keys can be UUIDs (client generates before sending request)

CONS:
• 16 bytes vs 8 bytes — larger indexes, more storage
• Random inserts into B-tree: new UUIDs go anywhere in the index → page splits → fragmentation → slower inserts at large scale
• Unreadable in support contexts — "could you check UUID 550e8400-..." is less friendly

UUID v7 (time-ordered UUID — the best of both):
Timestamp in first 48 bits + random bits.
• Ordered like sequential IDs (recent UUIDs sort after older ones)
• No central coordination needed
• No fragmentation problem
• Non-guessable despite ordering
• RECOMMENDED for modern banking systems

BANKING RECOMMENDATION:
• Transaction IDs, payment IDs: UUID v7 — distributed generation, ordered, client can pre-generate for idempotency
• Internal ledger line items: sequential BIGSERIAL — single DB, high volume inserts, ordering natural
• External-facing reference numbers: sequential with prefix (TXN-2024-0045231) — human readable for support + customer communication
• Never expose raw sequential IDs externally — use UUID in API responses, resolve internally to sequential for storage` },
  ]
};

const DOMAIN_BANK = {
  id: "bank", title: "Banking Domain", icon: "🏦", color: "#f6a535",
  qa: [
    { level:"Basic", q:"What is double-entry bookkeeping? Why is it universal in banking?",
      a:`Double-entry: every financial transaction affects at least two accounts — one debited, one credited — and total debits always equal total credits.

WHY UNIVERSAL:
• Self-auditing: If total debits ≠ total credits anywhere, there's a bug or fraud. System detects it automatically.
• Immutable history: Never update an entry — add a correcting entry. Full history preserved.
• Regulatory compliance: RBI, GAAP, IAS all require it.
• Money conservation: No money created or destroyed — only moves between accounts.

Example — ₹10,000 transfer from Customer A to Customer B:
DR  Customer A Account    ₹10,000  (balance decreases)
CR  Customer B Account    ₹10,000  (balance increases)
Total DR = Total CR = ₹10,000 ✓

Example — Bank charges ₹500 fee:
DR  Customer Account      ₹500  (customer pays)
CR  Fee Income Account    ₹500  (bank earns)

Technical implementation:
• journal_lines table: each row is one side of one entry (debit or credit, account_id, amount)
• Constraint: sum(debit) = sum(credit) per journal_entry_id
• Balance: maintained as running total updated atomically, or derived from sum of all entries
• Append-only: entries never modified or deleted — only reversed with new counter-entries` },

    { level:"Basic", q:"What is KYC and how does it affect banking system design?",
      a:`KYC (Know Your Customer) is the process of verifying a customer's identity before providing banking services. Mandated by RBI and the Prevention of Money Laundering Act (PMLA).

KYC COMPONENTS:
• Identity verification: PAN card, Aadhaar, Passport
• Address verification: utility bill, Aadhaar
• Photograph
• Source of funds declaration (for large accounts)

IMPACT ON SYSTEM DESIGN:

DATA STORAGE:
• KYC documents stored encrypted (AES-256) in secure document store (S3 with versioning, not in DB)
• Only metadata in DB: document type, verification status, expiry date, storage reference
• PII (Aadhaar number): stored masked (XXXX XXXX 1234). Never full number in DB.
• KYC data subject to strict access control — not accessible by regular application users

VERIFICATION WORKFLOW:
• Document upload → OCR extraction → automated verification → manual review queue
• Aadhaar verification: UIDAI API (OTP-based, face match)
• PAN verification: Income Tax Department API
• Video KYC (VKYC): recorded, stored, retained 8 years minimum

KYC EXPIRY:
• KYC has validity periods (varies by risk category: 2, 5, or 10 years per RBI)
• System must track expiry and trigger re-KYC workflow before expiry
• Account restricted if KYC expires without renewal

PERIODIC KYC (ongoing monitoring):
• High-risk accounts: annual review
• Medium-risk: every 8 years
• Low-risk: every 10 years
• System must automatically flag accounts due for review

C-KYC (Central KYC Registry):
• CERSAI maintains central KYC registry
• Banks can use existing C-KYC instead of collecting documents again
• API integration to fetch and update C-KYC records` },

    { level:"Basic", q:"What is NEFT, RTGS, and IMPS? How do they differ technically?",
      a:`Three interbank fund transfer systems in India, each with different settlement mechanisms.

NEFT (National Electronic Funds Transfer):
• Settlement: batch-based. Transactions collected in half-hourly batches. 48 settlement cycles/day (6 AM to 7 PM on weekdays).
• Amount: no minimum, no maximum
• Availability: 24x7x365 (since December 2019)
• Speed: typically 30 minutes to 2 hours
• Technical: SFMS (Structured Financial Messaging System) — SWIFT-like messaging between banks and RBI
• Use case: bulk payments, vendor payments, non-urgent transfers

RTGS (Real Time Gross Settlement):
• Settlement: real-time, individual transaction — no batching. Each payment settled immediately, gross (not netted).
• Amount: minimum ₹2 lakh, no maximum
• Availability: 24x7x365 (since December 2020)
• Speed: typically 30 seconds to 1 minute (bank to bank, through RBI settlement infrastructure)
• Technical: Proprietary RBI RTGS system. Banks connect via SFMS.
• Use case: high-value corporate payments, property transactions, large B2B

IMPS (Immediate Payment Service):
• Settlement: real-time, processed immediately
• Amount: up to ₹5 lakh (increased limits being considered)
• Availability: 24x7x365
• Speed: typically < 30 seconds
• Technical: NPCI infrastructure — same as UPI's underlying mechanism
• Use case: retail transfers, UPI is built on IMPS rails

TECHNICAL DIFFERENCES:
• NEFT: store-and-forward, batch settlement, guaranteed but not instant
• RTGS: real-time gross — each payment individually settled in RBI's books. Large amounts: counterparty credit risk eliminated.
• IMPS: real-time, NPCI-intermediated, designed for mobile/retail

For system design: UPI wraps IMPS. Corporate banking systems integrate all three based on amount and urgency. Routing logic: amount < ₹2L → IMPS/UPI; amount ≥ ₹2L and urgent → RTGS; bulk/non-urgent → NEFT.` },

    { level:"Basic", q:"What is AML and how does a banking system detect suspicious transactions?",
      a:`AML (Anti-Money Laundering) is the set of processes and controls to detect and prevent the use of the banking system to launder illegally obtained money. Mandated by PMLA (Prevention of Money Laundering Act) and RBI guidelines.

THREE STAGES OF MONEY LAUNDERING:
1. Placement: introducing illegal cash into financial system (cash deposits below reporting threshold — "structuring")
2. Layering: moving money through complex transactions to obscure origin
3. Integration: withdrawing/using money that appears legitimate

HOW SYSTEMS DETECT:

RULE-BASED DETECTION:
• Cash Transaction Report (CTR): auto-generate for any cash transaction > ₹10 lakh
• Structuring detection: multiple cash deposits just below ₹10L within short period by same customer
• Unusual transaction patterns: customer normally receives ₹50K/month, suddenly ₹50L in one day
• New beneficiary: large amount to new beneficiary immediately after account opening
• High-risk jurisdictions: transactions involving countries on FATF watchlist

BEHAVIOURAL ANALYTICS:
• Peer group analysis: compare customer's pattern with similar profile (same occupation, age, income)
• Velocity checks: transaction frequency anomaly
• Network analysis: graph of fund flows to detect money mule networks (A → B → C → D → cash out)

REGULATORY REPORTING:
• STR (Suspicious Transaction Report): filed with FIU-IND within 7 days of suspicion
• CTR (Cash Transaction Report): filed monthly for all cash transactions > ₹10L
• CCR (Cross Border Wire Transfer Report): international transfers > $25,000

WORKFLOW:
Detection rule/model triggers alert → analyst review → SAR/STR decision → report to FIU-IND via online portal → continue monitoring the customer (or exit the relationship for high-risk)

SYSTEM DESIGN:
• AML rule engine runs on transaction events from Kafka
• Case management system for analyst workflow
• FIU-IND reporting integration (goAML platform)
• Audit trail: every alert, every analyst decision, every report submission` },

    { level:"Basic", q:"What is a SWIFT message? Why does it matter for international payments?",
      a:`SWIFT (Society for Worldwide Interbank Financial Telecommunication) is the messaging network used for international bank-to-bank communication. Banks use standardised message formats to instruct transfers, confirm trades, and exchange financial information.

KEY MESSAGE TYPES:
• MT103: Single Customer Credit Transfer — standard international payment instruction. Customer A sends ₹10L to John in USA. Bank generates MT103 → sent via SWIFT network to correspondent bank → credited to beneficiary.
• MT202: Bank-to-Bank Transfer — when your bank doesn't have a direct relationship with the destination bank, it routes through correspondent banks using MT202.
• MT940/MT942: Account Statement — banks receive statements from their nostro accounts abroad.

HOW A SWIFT PAYMENT FLOWS:
Customer initiates international transfer.
Bank validates, checks AML/OFAC/sanctions.
Bank generates MT103 message (with BIC codes, amount, beneficiary details, charges).
MT103 sent through SWIFT network to recipient bank (possibly via 1-2 correspondent banks).
Recipient bank credits beneficiary account.
Total time: same day to 3-5 business days depending on correspondent chain.

WHY IT MATTERS FOR SYSTEM DESIGN:
• SWIFT messages have strict format requirements — any deviation rejects the message
• Integration: bank systems generate and parse MT/MX messages via SWIFT Alliance or equivalent
• ISO 20022 (MX messages): new standard replacing MT messages. RBI mandated migration. Richer data, XML-based, better AML screening capability.
• Sanctions screening: every SWIFT message must be checked against OFAC, UN sanctions list before sending — automated, real-time check
• Correspondent banking relationships: maintain nostro/vostro accounts — tracking these balances is a system design challenge
• SWIFT gpi: new tracking standard — end-to-end payment tracking like parcel tracking for money` },

    { level:"Basic", q:"What is a core banking system (CBS)? Name a few and explain their architecture.",
      a:`A Core Banking System (CBS) is the central software that processes all banking transactions and updates accounts across all branches in real-time. "Core" = centralised online real-time exchange.

What CBS handles:
• Account opening, maintenance, closure
• Deposits and withdrawals
• Loans and EMI processing
• Interest calculation and posting
• Cheque processing
• Integration with payment networks (NEFT, RTGS, UPI)

MAJOR CBS IN INDIA:
• Finacle (Infosys): used by SBI, Union Bank, Axis Bank, Canara Bank
• BaNCS (TCS): HDFC Bank, Kotak, Karnataka Bank
• i-flex/FLEXCUBE (Oracle): ICICI Bank, Yes Bank
• Temenos T24: smaller private banks, some cooperative banks

ARCHITECTURE:
• Traditionally: monolithic, centralised — one large application on mainframes/Unix servers
• Modern trend: decomposing CBS into APIs. Finacle APIs, FLEXCUBE web services — allowing modern microservices to call CBS for account operations
• 24/7 availability: CBS runs continuous. "End of day" processing for interest calculation runs during low-traffic windows (typically 12 AM - 3 AM)

CBS INTEGRATION for new systems:
• Modern payment services call CBS APIs for balance check, debit, credit
• CBS typically exposes: checkBalance, debitAccount, creditAccount, getAccountDetails as web services or REST APIs
• Performance: CBS APIs are often the bottleneck — designed for branch transactions, not 10K TPS from UPI
• Caching layer (Redis) in front of CBS balance reads significantly reduces CBS load

Modern banks are building "Banking as a Platform" — CBS handles core account management; everything else (UPI, lending, investments) built as modern microservices around it.` },

    { level:"Basic", q:"Explain the concept of a Nostro and Vostro account.",
      a:`Nostro and Vostro describe the same account from two different perspectives in correspondent banking.

NOSTRO ACCOUNT: "Our money held at your bank" (Latin: "ours")
From the perspective of the bank that owns the funds:
SBI has a USD account at Citibank New York.
For SBI: that USD account is SBI's NOSTRO account at Citibank.
Purpose: SBI uses this account to settle USD transactions for its customers.

VOSTRO ACCOUNT: "Your money held at our bank" (Latin: "yours")
From the perspective of the bank holding the funds:
Citibank holds the USD account for SBI.
For Citibank: that account is SBI's VOSTRO account at Citibank.

WHY THEY MATTER:
International payments don't move physically — they're settled through nostro/vostro accounts.
SBI customer sends $10,000 to a US beneficiary:
1. SBI debits customer's INR account (converted at current rate)
2. SBI instructs Citibank (via SWIFT MT103) to debit SBI's USD nostro account
3. Citibank debits SBI's account and credits the beneficiary's bank

SYSTEM DESIGN IMPLICATIONS:
• Nostro account reconciliation: bank must reconcile its nostro accounts daily against statements received from correspondent banks (MT940 statements)
• Nostro balance management: maintain sufficient balance in each currency/correspondent bank — too little: can't settle payments; too much: idle capital cost
• Nostro monitoring system: real-time tracking of balance across all correspondent banks
• Debit float management: time difference between when debit is initiated and when nostro is actually debited
• System must track: expected nostro movements (pending outgoing payments) vs actual nostro balance` },

    { level:"Basic", q:"What is a credit score and how might a bank's system use it?",
      a:`A credit score is a numerical expression of a borrower's creditworthiness based on their credit history. In India, CIBIL (TransUnion), Experian, Equifax, and CRIF High Mark are the four licensed credit bureaus.

CIBIL SCORE:
• Range: 300-900 (higher = better)
• Above 750: excellent — loan approvals likely, best interest rates
• 650-750: good — approvals likely with some conditions
• Below 650: poor — higher risk, may face rejections or high rates

WHAT DETERMINES IT:
• Payment history (35%): did you pay EMIs on time?
• Credit utilisation (30%): what % of credit limit are you using?
• Credit history length (15%): how long have you had credit?
• Credit mix (10%): variety of credit types
• New inquiries (10%): how many recent credit applications?

BANKING SYSTEM DESIGN — HOW CREDIT SCORE IS USED:

LOAN ORIGINATION:
• Customer applies for loan → system calls CIBIL API (real-time hard inquiry)
• Score received in response
• Decision engine applies rules: score > 700 → auto-approve; 600-700 → manual review; < 600 → auto-reject
• CIBIL check itself affects score slightly (hard inquiry) — track and limit inquiries

CREDIT CARD LIMIT SETTING:
• Score + income determines initial limit
• Periodic soft inquiries for limit enhancement decisions

RISK-BASED PRICING:
• Higher score → lower interest rate offered (lower default risk)
• Rates pre-computed per score band and stored in product configuration

INTEGRATION:
• REST API call to bureau at time of credit decision
• Response cached briefly (not stored long-term — stale data is risky and regulatory issue)
• Bureau API has cost per call — batch soft checks for portfolio monitoring, real-time hard checks for origination only
• Consent management: customer must consent to bureau check — log consent timestamp and method` },

    // INTERMEDIATE BANK
    { level:"Intermediate", q:"What is the Maker-Checker workflow? Design it technically.",
      a:`Maker-Checker (four-eyes principle): one person creates a transaction, a DIFFERENT authorised person approves it before execution. RBI-mandated for sensitive operations.

Use cases: Large transfers, new beneficiary addition, bulk payroll, interest rate changes, limit modifications, user access changes.

DATABASE DESIGN:
CREATE TABLE pending_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type VARCHAR(50) NOT NULL,     -- FUND_TRANSFER, BENEFICIARY_ADD, etc.
  payload JSONB NOT NULL,                  -- operation-specific data
  status VARCHAR(20) DEFAULT 'PENDING',    -- PENDING, APPROVED, REJECTED, EXPIRED, EXECUTED
  created_by VARCHAR(100) NOT NULL,        -- maker user ID
  created_at TIMESTAMP DEFAULT NOW(),
  checker_required_role VARCHAR(50),       -- role needed to approve
  expires_at TIMESTAMP,                    -- auto-expire if not actioned
  checked_by VARCHAR(100),                 -- approver user ID
  checked_at TIMESTAMP,
  rejection_reason TEXT,
  executed_at TIMESTAMP,
  execution_error TEXT,
  CONSTRAINT maker_checker_different CHECK (checked_by IS NULL OR checked_by != created_by)
);

WORKFLOW:
1. Maker submits operation → INSERT INTO pending_operations (status=PENDING)
2. Notify checker: email + in-app notification with operation details
3. Checker reviews → APPROVE or REJECT
4. On APPROVE:
   BEGIN TRANSACTION
     UPDATE pending_operations SET status='APPROVED', checked_by=?, checked_at=NOW()
     Execute actual operation (transfer, etc.)
     UPDATE pending_operations SET status='EXECUTED', executed_at=NOW()
   COMMIT
   (If execution fails: status=EXECUTION_FAILED, alert maker and checker)
5. On REJECT: status=REJECTED, notify maker with reason
6. Expiry job: UPDATE pending_operations SET status='EXPIRED' WHERE expires_at < NOW() AND status='PENDING'

TECHNICAL CONSTRAINTS:
• Maker and Checker cannot be same user: enforced in DB (CHECK constraint) AND application (double enforcement)
• Checker must have correct role: validate before displaying for approval
• Execution is idempotent: if system crashes between APPROVED and EXECUTED, retry execution safely
• Audit: all state transitions logged with who, when, why

BULK OPERATIONS:
Maker creates batch (e.g., 5,000 salary payments) → Checker reviews summary (total amount, employee count, sample entries) → Approves batch → System processes individually with idempotency guarantees` },

    { level:"Intermediate", q:"Explain how loan EMI calculation works. How would you design a loan management system?",
      a:`EMI (Equated Monthly Instalment) = fixed monthly payment covering both principal and interest over loan tenure.

EMI FORMULA:
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
Where:
P = Principal loan amount
r = Monthly interest rate (annual rate / 12)
n = Number of months

Example: ₹10,00,000 loan at 10% per annum for 5 years (60 months)
r = 10/(100×12) = 0.00833
EMI = 10,00,000 × 0.00833 × (1.00833)^60 / ((1.00833)^60 - 1) = ₹21,247 approx

AMORTISATION SCHEDULE:
Each month's EMI splits into:
• Interest component = Outstanding principal × monthly rate
• Principal component = EMI - Interest component

Month 1: Interest = 10,00,000 × 0.00833 = ₹8,333. Principal = 21,247 - 8,333 = ₹12,914. Remaining = ₹9,87,086
Month 2: Interest = 9,87,086 × 0.00833 = ₹8,225. Principal = ₹13,022...
Over time: interest portion decreases, principal portion increases.

LOAN MANAGEMENT SYSTEM DESIGN:

LOAN ORIGINATION:
• Application → Credit check → Sanction → Agreement → Disbursement
• Disbursement: credit loan amount to customer account, create loan account in CBS

SCHEDULE GENERATION:
• Generate full amortisation schedule at sanction time
• Store in loan_schedules table: (loan_id, due_date, principal_due, interest_due, total_due, status)
• Regenerate on prepayment, moratorium, rate change

EMI COLLECTION:
• Due date approaching: system auto-generates debit instruction to customer's savings account (NACH mandate)
• NACH debit processed via NPCI → amount collected on due date
• If NACH fails (insufficient balance): mark as bounced, apply bounce charge, retry or flag for manual collection

INTEREST CALCULATION:
• Daily accrual: most banks accrue interest daily (actual/365 basis)
• Month-end posting: accumulated accrual posted to P&L
• Overdue interest: different (higher) rate applies after due date

PREPAYMENT:
• Customer pays extra → reduce outstanding principal
• Recalculate schedule: either reduce EMI (same tenure) or reduce tenure (same EMI) — customer's choice
• Prepayment charges apply in some products (regulated by RBI for retail loans)

REPORTING:
• NPA (Non-Performing Asset): loan overdue > 90 days → classified NPA → provisioning impact
• System auto-classifies NPA daily batch job` },

    { level:"Intermediate", q:"What is a payment gateway? How does a card payment flow work end-to-end?",
      a:`A payment gateway is the technology that connects a merchant's system to the card networks and issuing banks to process card payments.

PARTICIPANTS:
• Cardholder: customer with card
• Merchant: the seller
• Acquirer bank: merchant's bank (processes card payments on merchant's behalf)
• Card network: Visa, Mastercard, RuPay (routes between acquirer and issuer)
• Issuer bank: customer's bank (issues the card)
• Payment gateway: technical intermediary between merchant and acquirer

CARD PAYMENT FLOW:

AUTHORISATION (real-time, < 3 seconds):
1. Customer enters card details on merchant checkout
2. Merchant system → Payment Gateway → (encrypted card data)
3. Gateway → Acquirer Bank → (ISO 8583 message with card data, amount, merchant details)
4. Acquirer → Card Network (Visa/Mastercard) → route to Issuer
5. Issuer: validate card details, check balance/limit, run fraud checks
6. Issuer → Network → Acquirer: APPROVED (or DECLINED with reason code)
7. Acquirer → Gateway → Merchant: auth response with authorisation code

At this point: card is AUTHORISED but money not yet moved. Merchant's account shows "pending."

CAPTURE (initiates settlement):
Merchant sends capture request (usually immediately after auth, or at shipment).
Capture confirms: yes, charge this amount.

SETTLEMENT (end of day):
Merchant sends all captured transactions as a batch to acquirer.
Acquirer sends to card networks for settlement.
Networks net out what each bank owes each other.
Issuer transfers funds to acquirer (via card network settlement).
Acquirer credits merchant account (minus acquiring fee, interchange, gateway fee).
Total settlement time: T+1 to T+2 days.

3D SECURE (OTP):
After step 2: gateway redirects customer to issuer's 3DS page.
Customer enters OTP sent to registered mobile.
Issuer verifies OTP, issues auth token.
Then authorisation flow continues.
Mandated by RBI for all card-present and card-not-present transactions in India.` },

    { level:"Intermediate", q:"What is NACH and how does it work for recurring payments in India?",
      a:`NACH (National Automated Clearing House) is NPCI's platform for bulk and recurring payment processing. Used for: EMI collections, salary credits, SIP investments, insurance premiums, utility bills.

TWO TYPES:
• NACH Debit: initiator (bank/institution) pulls money from customer account (EMI collection)
• NACH Credit: initiator pushes money to multiple accounts (salary credit, subsidy disbursement)

NACH DEBIT FLOW:

MANDATE REGISTRATION (one-time):
1. Customer signs NACH mandate (physical or eNACH digital)
2. Bank/institution uploads mandate to NPCI NACH system via destination bank
3. NPCI validates mandate, registers against customer's account at their bank
4. Mandate has: maximum amount, frequency, start date, end date

RECURRING COLLECTION:
1. Institution prepares file: list of (account number, IFSC, amount, reference) for all due EMIs
2. File uploaded to NPCI NACH system by institution's bank (sponsor bank)
3. NPCI routes debit instructions to each customer's bank (destination bank)
4. Destination bank checks: mandate active? Amount within limit? Sufficient balance?
5. SUCCESS: debit customer account → credit institution's account
   FAILURE: return with reason code (insufficient funds, mandate expired, account closed)
6. Settlement: net amounts settled between banks
7. Institution receives success/failure file — update loan/policy records accordingly

ENACH (Digital Mandate):
Customer fills mandate online → OTP verification → Aadhaar-based or net-banking authentication → mandate registered digitally (no physical form).
Used for: online loan applications, insurance, SIPs.

SYSTEM DESIGN IMPLICATIONS:
• File generation: batch job at night generates NACH presentation file for next day's due payments
• File format: NPCI-specified format with fixed-width records
• Return handling: process return file from NPCI, update statuses, apply bounce charges
• Retry logic: bounce → retry after 3 days (if mandate allows) → escalate to collections
• Reconciliation: match presented amounts vs settled amounts vs returns` },

    { level:"Intermediate", q:"How does a bank manage liquidity? What are CRR and SLR?",
      a:`Liquidity management ensures the bank always has enough liquid assets to meet obligations — customer withdrawals, interbank settlements, regulatory requirements.

CRR (Cash Reserve Ratio):
Mandated by RBI. Banks must maintain a percentage of their Net Demand and Time Liabilities (NDTL) as cash with RBI. Currently ~4.5%.

Example: Bank has ₹1,000 crore in deposits (NDTL). Must keep ₹45 crore as cash with RBI.
This cash earns no interest — it's a regulatory tax on deposits.
RBI uses CRR as a monetary policy tool: increase CRR → banks have less to lend → money supply decreases → inflation control.

SLR (Statutory Liquidity Ratio):
Banks must maintain a percentage of NDTL in liquid assets: government securities (G-Secs), gold, or approved securities. Currently ~18%.

Example: ₹1,000 crore deposits → ₹180 crore must be in G-Secs or gold.
Unlike CRR, SLR assets earn interest (G-Secs have coupons).
RBI uses SLR to: ensure banks always have liquid assets to sell if needed, channel funds to government borrowing.

SYSTEM DESIGN FOR CRR/SLR:

DAILY CALCULATION:
• Batch job runs at night: calculate NDTL from all deposit balances
• Calculate required CRR (NDTL × CRR%) and SLR (NDTL × SLR%)
• Check actual cash at RBI and G-Sec holdings
• If deficient: trigger alert to Treasury, they buy G-Secs or borrow from interbank market

REPORTING:
• Weekly returns to RBI showing CRR compliance (Form A)
• Daily monitoring by Treasury team
• Penalty for CRR/SLR breach: significant (3% above bank rate for shortfall)

TREASURY MANAGEMENT SYSTEM:
• Tracks all G-Sec holdings (ISIN, face value, market value, maturity)
• Marks to market daily
• Calculates SLR eligible value
• Integrates with RBI's NDS-OM (Negotiated Dealing System) for G-Sec trading` },

    { level:"Intermediate", q:"What is Basel III and how does it impact banking system design?",
      a:`Basel III is the international regulatory framework for banks, issued by the Basel Committee on Banking Supervision, implemented in India by RBI as part of capital adequacy requirements.

KEY REQUIREMENTS:

CAPITAL ADEQUACY:
Banks must hold minimum capital against risk-weighted assets.
• Minimum CAR (Capital Adequacy Ratio): 9% in India (Basel minimum 8%)
• Common Equity Tier 1 (CET1): 5.5% (highest quality capital — equity + retained earnings)
• Additional Tier 1: 1.5% (AT1 bonds)
• Tier 2 capital: 2% (subordinated debt)

LIQUIDITY REQUIREMENTS:
• LCR (Liquidity Coverage Ratio): banks must hold enough High Quality Liquid Assets (HQLA) to survive 30-day stress scenario. LCR ≥ 100%.
• NSFR (Net Stable Funding Ratio): stable funding over 1 year ≥ funding requirements. NSFR ≥ 100%.

SYSTEM DESIGN IMPLICATIONS:

RISK-WEIGHTED ASSET (RWA) CALCULATION:
• Every asset class has a risk weight: cash (0%), government bonds (0%), corporate loans (100%), mortgages (50%), etc.
• System must calculate RWA across entire loan and investment portfolio daily
• Risk weights change with rating changes, collateral, and Basel methodology updates

CAPITAL REPORTING:
• Daily CAR monitoring → alert if approaching minimum
• Quarterly Basel III disclosures (Pillar 3) published on bank website
• System generates: credit risk reports, market risk reports, operational risk capital calculations

LCR MONITORING:
• Daily: identify all HQLA holdings (G-Secs, cash, RBI deposits)
• Calculate net cash outflows under 30-day stress scenario
• LCR = HQLA / net cash outflows × 100
• System pulls data from treasury, retail deposits, wholesale funding systems

STRESS TESTING:
• RBI requires periodic stress tests — what happens to capital if NPAs increase 2x? If interest rates spike?
• Requires simulation framework running bank's portfolio through adverse scenarios
• Results reported to RBI quarterly` },

    { level:"Intermediate", q:"What is a SWIFT gpi? How does it improve cross-border payment tracking?",
      a:`SWIFT gpi (Global Payments Innovation) is SWIFT's initiative to improve the speed, transparency, and traceability of cross-border payments. Launched in 2017, now covering 50% of SWIFT traffic.

PROBLEMS WITH TRADITIONAL SWIFT:
• No end-to-end tracking — sender doesn't know where payment is
• Variable fees deducted along correspondent chain — recipient receives less than expected
• Settlement time: 1-5 business days, unpredictable
• No standardised failure notification — payment could be stuck anywhere

SWIFT gpi IMPROVEMENTS:

UETR (Unique End-to-End Transaction Reference):
• Every gpi payment gets a UUID4 UETR assigned by the initiating bank
• UETR travels with the payment through every correspondent bank
• Any bank can look up the payment by UETR in SWIFT's tracking database

TRACKING (like parcel tracking for money):
• Every bank in the chain updates the gpi Tracker when they process the payment
• Sender (and recipient) can see: "Payment received by Citibank London at 14:32, forwarded to Deutsche Bank Frankfurt at 14:45, credited to beneficiary at 15:12"
• Real-time status updates available via gpi APIs

CONFIRMED CREDIT:
• Receiving bank confirms credit to beneficiary account with timestamp
• End-to-end confirmation available to originating bank and customer

SAME-DAY SETTLEMENT:
• gpi service level: payments credited within same business day of receipt by recipient bank
• RBI has adopted gpi as part of Bharat Bill Payment international extension

SYSTEM DESIGN FOR gpi:
• Generate UETR at payment initiation (UUID4)
• Include in all SWIFT messages (MT103 field 121)
• API integration to gpi Tracker: update status at each processing step
• Customer-facing tracking: expose payment status via API/portal using UETR
• Reconciliation: gpi confirmation as authoritative settlement proof` },

    // ADVANCED BANK
    { level:"Advanced", q:"Design a reconciliation system for a payment gateway handling ₹1,000 crore/day.",
      a:`Reconciliation matches internal records with external records to ensure no transaction is missing, duplicated, or incorrectly processed. At ₹1,000 crore/day (~50K-100K transactions), this requires automation and rigour.

RECONCILIATION TYPES:

1. INTERNAL RECONCILIATION:
Match payment service DB records against ledger entries.
Every payment in payment_service table → must have corresponding ledger debit+credit.
Discrepancy: payment marked successful but no ledger entry → serious bug, potential money loss.

2. ACQUIRING BANK RECONCILIATION:
Match your records against acquiring bank settlement file (delivered daily via SFTP).
Your records: 47,231 transactions totalling ₹847.3 crore.
Bank file: 47,228 transactions totalling ₹847.1 crore.
→ 3 transactions and ₹0.2 crore missing → investigate.

3. CARD NETWORK RECONCILIATION:
Match acquiring bank records against Visa/Mastercard interchange files.
Catches: disputes, chargebacks, interchange fees.

SYSTEM ARCHITECTURE:

DATA INGESTION:
• Internal data: pull from payment DB and ledger (read replica)
• External data: SFTP poller downloads bank settlement files → parse → normalise → load to staging table
• All data timestamped and checksummed at ingestion

MATCHING ENGINE:
• Primary match key: merchant transaction ID (must exist in both sources)
• Secondary match: amount, date, card last 4 digits (for cards)
• Match categories:
  MATCHED: both sides agree on all fields ✓
  INTERNAL_ONLY: in our system, not in bank file (bank lag, failed settlement)
  EXTERNAL_ONLY: in bank file, not our system (critical — potential unrecorded transaction)
  AMOUNT_MISMATCH: both present but amounts differ (fee issue, FX rounding)
  DATE_MISMATCH: processed on different dates

AUTO-RESOLUTION:
• INTERNAL_ONLY < 24 hours old: normal bank processing lag → re-check in next cycle
• INTERNAL_ONLY > 48 hours: escalate to bank relationship team
• EXTERNAL_ONLY any age: immediate alert — potential unrecorded payment → P1 incident
• AMOUNT_MISMATCH: if < ₹10 and looks like FX rounding: auto-resolve. Else: manual queue.

MONITORING:
• Match rate: target 99.99% by T+1. Alert if < 99.9%.
• EXTERNAL_ONLY count trending up: potential system bug
• INTERNAL_ONLY aging report: anything > 48 hours

REPORTING:
• Daily reconciliation report to Finance team and CFO dashboard
• Monthly: reconciliation summary for auditor review
• Exception log: all unresolved items with aging and assigned owner` },

    { level:"Advanced", q:"How does RBI's Account Aggregator (AA) framework work? Design a system to integrate with it.",
      a:`Account Aggregator (AA) is a consent-based financial data sharing framework regulated by RBI. It allows customers to share their financial data (from multiple Financial Information Providers) with Financial Information Users (banks, NBFCs, fintechs) — all with explicit consent.

PARTICIPANTS:
• Account Aggregator (AA): licensed intermediary (NSDL AA, Finvu, Anumati, etc.) — manages consent, routes data
• Financial Information Provider (FIP): entities holding financial data (banks, MFs, insurance) — source of data
• Financial Information User (FIU): entity consuming data (bank doing credit assessment, fintech doing financial planning)

DATA FLOW:
1. FIU (e.g., a lending bank) needs income data for loan applicant
2. FIU creates consent request via AA: "I need last 12 months bank statement from customer's HDFC account"
3. AA sends consent request to customer's mobile app
4. Customer reviews and APPROVES (explicit, informed consent)
5. AA generates signed consent artefact
6. AA requests data from FIP (HDFC Bank) with consent proof
7. FIP validates consent, returns encrypted data directly to FIU via AA
8. FIU receives encrypted data, decrypts with session keys, uses for credit assessment

TECH SPECIFICATIONS:
• All communication: REST over HTTPS, TLS 1.3
• Data format: FIDE (Financial Information Data Exchange) JSON standard
• Data encryption: customer data encrypted with session keys — AA can't read it (privacy by design)
• Consent: digitally signed, verifiable, time-bound, purpose-limited

SYSTEM DESIGN FOR FIP INTEGRATION (if your bank is an FIP):

API ENDPOINTS to implement (RBI/Sahamati spec):
POST /FI/request — FIU via AA requests data
GET /FI/fetch/{sessionId} — AA fetches data after FIP prepares it
POST /Consent/Notification — AA notifies FIP of new/revoked consent

DATA PREPARATION:
• Receive consent artefact → validate digital signature from AA
• Verify: consent is valid, not expired, data range within consent scope
• Fetch data from core banking for that account and date range
• Convert to FIDE JSON format (standardised bank statement format)
• Encrypt with session public key (only FIU can decrypt)
• Return encrypted payload

CONSENT MANAGEMENT:
• Store all consent artefacts — what data was shared, when, with whom
• Customer can REVOKE consent → receive revocation notification → stop serving data
• RBI requires: complete audit trail of all data sharing instances` },

    { level:"Advanced", q:"Explain UPI 2.0 features and their technical implications.",
      a:`UPI 2.0 was launched in 2018 adding significant features to the base UPI infrastructure. Understanding these is essential for banking engineers integrating UPI.

FEATURE 1 — OVERDRAFT ACCOUNT LINKING:
• UPI 1.0: only savings/current accounts
• UPI 2.0: overdraft accounts can be linked
• Technical implication: balance check must handle negative balance (overdraft limit — current balance)
• Authorization: bank must validate overdraft limit before confirming transaction
• Reporting: overdraft transactions flagged differently in RBI reporting

FEATURE 2 — ONE-TIME MANDATE (UPI AutoPay):
Pre-authorise a future payment — customer sets up mandate today, execution happens on future date.
Use cases: SIP investments, insurance premiums, subscription payments.

Technical flow:
CREATE MANDATE: Merchant → NPCI → Customer's bank: register mandate with amount, frequency, execution date
EXECUTE MANDATE: On due date, NPCI triggers auto-debit against registered mandate
REVOKE: Customer can revoke anytime before execution
Technical: mandate has maximum amount (≤ ₹15,000 requires no additional auth per execution; ≥ ₹15,000 requires OTP on execution day)

FEATURE 3 — INVOICE IN THE INBOX:
Merchant sends invoice to customer's UPI app before requesting payment.
Customer reviews invoice → approves → payment initiated.
Technical: merchant generates invoice in UPI standardised format → NPCI routes to customer's PSP app → customer sees invoice before payment → consent-based

FEATURE 4 — SIGNED INTENT & QR:
QR codes now digitally signed by merchants → PSP apps can verify authenticity before showing payment screen
Technical: merchant's VPA/account details signed with merchant's certificate → PSP validates signature → prevents fake QR code scams

UPI CIRCLE (2023 addition):
Delegated payments: primary account holder delegates limited UPI access to family member (e.g., UPI Lite, specific amount limits).
Technical: delegation parameters stored at NPCI level — delegated user's UPI linked to primary account with access constraints` },

    { level:"Advanced", q:"How would you design the interest calculation engine for a savings bank?",
      a:`Savings bank interest calculation in India follows RBI guidelines: interest calculated daily on minimum balance and credited monthly (previously quarterly; changed to monthly by RBI in 2010).

RBI GUIDELINES:
• Rate: minimum 2.7-3% per annum (varies by bank)
• Calculation basis: DAILY BALANCE METHOD — interest on each day's closing balance
• Crediting: monthly (last working day of month)
• Compounding: monthly (interest earned credits to account, which then earns further interest)

FORMULA:
Daily Interest = (Daily Closing Balance × Annual Rate) / 365

Monthly Interest = SUM of daily interest for all days in the month

DESIGN:

DATA CAPTURE:
• End of day job: record daily closing balance for each account
  INSERT INTO daily_balances (account_id, balance_date, closing_balance)
  SELECT account_id, CURRENT_DATE, current_balance FROM accounts
  Run this at 11:59 PM after all day's transactions are processed

INTEREST CALCULATION BATCH (month-end):
For each account:
  SELECT SUM(closing_balance) as total_balance_days FROM daily_balances
  WHERE account_id = ? AND balance_date BETWEEN month_start AND month_end
  
  monthly_interest = (total_balance_days × annual_rate) / (365 × 100)
  
  Round to nearest paisa (2 decimal places) — use ROUND(value, 2) not truncation

INTEREST POSTING:
  BEGIN TRANSACTION
    INSERT INTO journal_lines (interest credit entry)
    UPDATE account_balances SET balance = balance + monthly_interest
    INSERT INTO interest_postings (account_id, period, amount, posted_at)
  COMMIT

EDGE CASES:
• Account opened mid-month: calculate only from opening date
• Account closed mid-month: calculate until closure date, post with closure
• Dormant accounts: still earn interest (unless zero balance)
• Minimum balance penalty: separate calculation, posted as debit
• Tax: TDS on interest > ₹40,000/year (₹50,000 for seniors) — deduct TDS at time of interest posting

PERFORMANCE AT SCALE (100 million accounts):
• Parallel processing: partition accounts across parallel workers (account_id % num_workers)
• Batch size: process 10,000 accounts per batch
• Time window: 4-hour batch window starting at midnight
• Progress tracking: batch job status table — restart from last checkpoint if job fails

TDS INTEGRATION:
• Track cumulative interest credited per financial year per PAN
• When cumulative exceeds threshold: calculate TDS on total interest, deduct, report to Income Tax
• Form 26AS filing: monthly TDS remittance, quarterly TDS certificate` },

    // EXPERT BANK
    { level:"Expert", q:"Design a real-time fraud detection system for corporate banking.",
      a:`Corporate banking fraud differs from retail — higher transaction values, B2B patterns, and false positives are very costly (blocking a ₹100 crore payroll run has serious consequences).

ARCHITECTURE LAYERS:

LAYER 1 — PRE-TRANSACTION RULES (synchronous, < 50ms):
Rule engine evaluates configurable rules in real-time.
Banking-specific rules:
• Velocity: > 5 transfers to new beneficiary in 1 hour → HOLD
• Amount anomaly: amount > 300% of account's 90-day average → HOLD
• Time anomaly: transaction at 3 AM for account with no historical off-hours activity → HOLD
• Beneficiary: new beneficiary + large amount + immediate transfer → HOLD
• Geography: login from Singapore, transaction from Mumbai within same session → HOLD
• Blacklist: beneficiary on RBI/ED/OFAC list → BLOCK

Technology: Drools rule engine or Redis Lua scripts (sub-5ms). Rules managed by business team via config UI, no deployment needed for rule changes.

LAYER 2 — ML SCORING (synchronous, < 100ms):
Feature vector: (amount, time_of_day, day_of_week, beneficiary_age_days, account_velocity_1h, account_velocity_24h, device_fingerprint_match, geo_velocity, amount_deviation_from_avg)
Model: XGBoost or LightGBM — fast inference
Output: fraud probability 0.0-1.0
Thresholds: > 0.85 → HOLD for review; > 0.97 → AUTO-BLOCK

Model served via feature store:
• Real-time features: Redis (updated every transaction — velocity, last beneficiary list)
• Historical features: Cassandra (90-day aggregates, precomputed in Spark)

LAYER 3 — ASYNC DEEP ANALYSIS:
• Graph analysis (Apache Spark/Neo4j): detect money mule networks across accounts
• Sequence models: LSTM on account's transaction history — detect account takeover pattern (sudden behaviour change after login from new device)
• Peer group: compare to similar-sized corporate accounts

CASE MANAGEMENT:
• Held transactions in operations dashboard
• Auto-assign to analyst based on amount tier: < ₹10L to Tier 1, ₹10L-1Cr to Tier 2, > ₹1Cr to senior analyst
• SLA: < 30 minutes to decision or auto-escalate
• Customer: SMS/email notification on hold, expected resolution time

ML FEEDBACK LOOP:
• Analyst decisions (confirmed fraud / false positive) → labelled training data
• Weekly model retraining with new data
• A/B testing framework: new model shadowed for 1 week (score but don't act) → compare against live model → promote if better F1 score

RBI COMPLIANCE:
• All decisions logged: rule triggered, ML score, analyst decision, outcome
• Confirmed cyber fraud: report to RBI CSITE within 6 hours
• False positive rate SLA: < 0.1% of legitimate corporate transactions held
• All logs retained 8 years` },

    { level:"Expert", q:"How would you design a system for RBI regulatory reporting (XBRL submissions)?",
      a:`RBI requires banks to submit detailed regulatory reports — balance sheet data, capital adequacy, exposure data — in XBRL (eXtensible Business Reporting Language) format. Getting this wrong has regulatory consequences.

XBRL OVERVIEW:
XBRL is a structured XML-based format for financial reporting. Each data point has a defined tag from RBI's taxonomy. Machines can parse, validate, and compare submissions across banks.

RBI REPORTS IN XBRL:
• Form A / Form B: weekly returns on reserve ratios
• Capital Adequacy (ICAAP): quarterly Basel III capital calculation
• Large Exposures (LE): exposure to single counterparty/group
• SFR (Supervisory Financial Return): comprehensive quarterly report
• Each has defined XBRL taxonomy — specific tags, data types, validation rules

SYSTEM ARCHITECTURE:

DATA COLLECTION:
• Reports pull data from: Core Banking (account balances, loans), Treasury (investments, FX positions), Risk (capital calculations, NPA data)
• All source systems expose data via standardised APIs or database views
• Data warehouse: consolidated view of all bank data for reporting (not from production)

DATA WAREHOUSE:
• Separate from transactional DB
• Populated via CDC (Debezium) from all source systems
• T+1 availability of previous day's data
• Historical data for comparative reporting
• Row-level access control: reporting team can't access customer PII — only aggregate data

XBRL GENERATION:
• Mapping layer: business data fields → XBRL taxonomy tags
• Mapping maintained in configuration (not hard-coded) — taxonomy updates don't require code changes
• XBRL library (Apache Tika or Java XBRL toolkit) generates valid XBRL instance document
• Validation: run XBRL validation rules before submission (RBI provides validation taxonomy)

SUBMISSION WORKFLOW:
• Report generated → auto-validated → sent to maker-checker queue
• CFO/compliance officer reviews summary → approves
• System digitally signs with DSC (Digital Signature Certificate) — mandatory
• Upload to RBI portal (XBRL viewer or API)
• Track acknowledgement number — store with submission record

RECONCILIATION:
• Cross-validate: capital adequacy numbers consistent with balance sheet?
• Numbers from XBRL report must tie back to general ledger — any discrepancy flagged before submission
• "Four-eye check": automated reconciliation + human review of key figures

AUDIT TRAIL:
• Every data point in submitted report traceable to source: which CBS transaction, which date, which system
• Complete version history of each report (drafts → final submission)
• Retained 5 years minimum
• Auditor access: read-only view of submitted reports and supporting data

CHANGE MANAGEMENT:
• RBI updates taxonomy periodically
• Change management process: taxonomy update → map new tags → validation update → UAT → production
• Typically 3-6 months lead time given by RBI for taxonomy changes` },

    { level:"Expert", q:"Design a system to handle foreign exchange (FX) for a corporate banking platform.",
      a:`FX operations in corporate banking involve currency conversion, risk management, and regulatory reporting for cross-border transactions.

FX COMPONENTS:

RATE MANAGEMENT:
• Bank receives real-time FX rates from multiple sources: Reuters, Bloomberg, correspondent banks
• Rate aggregation: weighted average or best rate across providers
• Rate publishing: API available to all bank systems for current rates
• Rate validity: rates expire every 30-60 seconds in live trading
• Mid-rate vs transaction rate: bank publishes mid-rate; actual transaction uses spread (buy rate for customer selling USD, sell rate for customer buying USD)

TRANSACTION TYPES:
• TT (Telegraphic Transfer): immediate FX conversion + SWIFT payment
• Forward contract: agree today to buy/sell currency at future date at locked rate
• Spot transaction: standard T+2 settlement

RATE ENGINE:
CREATE TABLE fx_rates (
  id BIGSERIAL PRIMARY KEY,
  base_currency CHAR(3),
  quote_currency CHAR(3),
  mid_rate DECIMAL(15,6),
  buy_rate DECIMAL(15,6),     -- bank buys base (customer sells)
  sell_rate DECIMAL(15,6),    -- bank sells base (customer buys)
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  source VARCHAR(50),
  spread_pct DECIMAL(5,4)
);

Rates stored with validity window — every query specifies timestamp, gets rate valid at that time.

FX TRANSACTION PROCESSING:
1. Customer requests: convert ₹10L to USD (sell INR, buy USD)
2. System fetches current sell rate (bank sells USD) from rate engine
3. Calculate: USD amount = ₹10L / sell_rate
4. Lock rate for 30 seconds (customer confirms)
5. Execute: debit INR account, credit USD account
6. If SWIFT remittance: initiate MT103 to beneficiary's bank
7. Post FX gain/loss to bank's P&L account

HEDGING AND OPEN POSITION:
• Bank accumulates FX risk as it processes customer transactions
• Treasury manages Open Currency Position (OCP): net exposure per currency
• Automatic hedging: when OCP exceeds threshold, Treasury system auto-hedges with interbank market
• RBI limit: Open Position must stay within approved limits — system monitors and alerts

RBI REPORTING:
• Daily: R-Return (FX transactions by category, amount, counterparty)
• Monthly: Form 10 (authorised dealer returns)
• All cross-border transactions > $25,000: CTR to FIU-IND
• All transactions classified by purpose code (RBI purpose code list: P0001-P6099)

NOSTRO MANAGEMENT:
• Bank must have USD in its USD nostro account to settle USD payments
• Nostro balance monitoring: alert if below minimum threshold
• Automated sweeping: if INR nostro at Bank of America runs low, Treasury purchases USD

REGULATORY CONSTRAINTS (RBI):
• LRS (Liberalised Remittance Scheme): individual can remit max $250,000/year abroad
• System must track per-PAN utilisation of LRS limit
• Reject/flag remittance if LRS limit exceeded
• Purpose restrictions: certain purposes prohibited for FX remittance (gambling, etc.)` },
  ]
};

const DOMAIN_SEC = {
  id: "sec", title: "Security & Compliance", icon: "🔒", color: "#ef4444",
  qa: [
    { level:"Basic", q:"What is the difference between authentication and authorisation?",
      a:`AUTHENTICATION: Verifying WHO you are. "Are you really KP?"
Methods: password, OTP, biometric, certificate, hardware token.
Banking examples: login with username+password+OTP; MPIN for UPI; fingerprint for mobile banking.

AUTHORISATION: Verifying WHAT you're allowed to do. "KP is authenticated — can KP approve a ₹50 crore transfer?"
Methods: RBAC (Role-Based), ABAC (Attribute-Based), ACL (Access Control List).
Banking examples: teller can view accounts but not approve loans; branch manager can approve up to ₹10L; HO can approve unlimited.

The sequence is always: authenticate first, then authorise.
A user can be authenticated (logged in) but not authorised (no permission for that action).

Common mistake in banking systems: checking authentication but not authorisation. Customer A is logged in → can they access Customer B's account statement? Authentication passes (A is logged in) but authorisation must prevent it.

TECHNICAL IMPLEMENTATION:
Authentication → issues JWT token containing: user_id, roles[], permissions[], expiry.
Each API request: validate JWT signature → extract roles → check against required permission for that endpoint.
Never store permissions only in the database and check per request — caches the permission in token (with short TTL for security-sensitive operations).` },

    { level:"Basic", q:"What is OAuth 2.0 and how is it used in banking APIs?",
      a:`OAuth 2.0 is an authorisation framework that allows a third party to access a user's resources without exposing credentials. The user grants permission; the third party gets an access token.

KEY FLOWS:

AUTHORISATION CODE FLOW (most secure, used for web/mobile apps):
1. User clicks "Connect your bank account" on fintech app
2. Fintech redirects to bank's authorisation server
3. User logs in at bank, sees consent screen: "Fintech wants to read your transactions for 30 days"
4. User approves → bank redirects back to fintech with authorisation code
5. Fintech backend exchanges code for access token (server-to-server, secret kept secure)
6. Fintech uses access token to call bank's API

CLIENT CREDENTIALS FLOW (machine-to-machine, no user involved):
Used for: Bank's internal services calling each other, NPCI to bank API calls.
Service authenticates with client_id + client_secret → gets access token → calls API.

BANKING USE CASES:
• RBI Account Aggregator framework: built on OAuth 2.0 + OpenID Connect
• Open Banking APIs: third-party apps access customer data with consent
• Internal API security: service-to-service auth using client credentials
• Mobile banking: authorisation code with PKCE (Proof Key for Code Exchange — prevents code interception)

TOKEN TYPES:
• Access Token: short-lived (15 min - 1 hr), presented to API
• Refresh Token: longer-lived (days-weeks), used to get new access token without re-login
• ID Token (OpenID Connect): contains user identity claims (name, email, customer_id)

BANKING SECURITY REQUIREMENTS:
• Access token TTL: 15 minutes maximum for financial APIs
• Refresh token rotation: each use issues new refresh token, old one invalidated
• Scope validation: access token must contain the specific scope required (accounts:read, payments:write)
• Token introspection: resource server validates token with auth server on each request (for high-security operations)` },

    { level:"Basic", q:"What is SQL injection? How do you prevent it in banking applications?",
      a:`SQL injection occurs when user input is included directly in a SQL query, allowing an attacker to modify the query's logic and access or manipulate data.

EXAMPLE OF VULNERABLE CODE:
String query = "SELECT * FROM accounts WHERE account_id = " + userInput;
If userInput = "1 OR 1=1", the query becomes:
SELECT * FROM accounts WHERE account_id = 1 OR 1=1
→ Returns ALL accounts. Attacker can also use: "1; DROP TABLE accounts; --"

PREVENTION:

1. PARAMETERISED QUERIES (primary defence):
// Safe — parameter is passed separately, never concatenated into SQL
PreparedStatement stmt = conn.prepareStatement("SELECT * FROM accounts WHERE account_id = ?");
stmt.setLong(1, accountId);
The database treats the parameter as data, never as SQL code. Unbreakable regardless of what the user inputs.

2. STORED PROCEDURES (when parameterised):
Procedures with parameterised inputs are equally safe.

3. INPUT VALIDATION:
Account ID must be a number — reject non-numeric input before it reaches the query.
Never rely on this alone — parameterised queries are the real protection.

4. ORM FRAMEWORKS:
JPA/Hibernate, Spring Data JPA — generate parameterised queries automatically.
Risk: native queries in JPA can still be vulnerable if you concatenate strings.
// DANGEROUS even in JPA:
entityManager.createNativeQuery("SELECT * FROM accounts WHERE id = " + id)

5. LEAST PRIVILEGE:
Application DB user should only have SELECT, INSERT, UPDATE on necessary tables.
No DROP, CREATE, GRANT permissions.
Even if injection occurs, damage is limited.

BANKING IMPACT OF SQL INJECTION:
• Read all customer accounts, balances, PAN numbers — massive data breach
• Modify account balances
• Delete audit logs
• Create fraudulent transactions
RBI notifies CSITE of data breaches — penalty and reputation damage severe.` },

    { level:"Basic", q:"What is HTTPS and TLS? Why is TLS 1.3 required in banking?",
      a:`HTTPS = HTTP + TLS (Transport Layer Security). TLS encrypts data in transit between client and server, preventing eavesdropping and tampering.

TLS HANDSHAKE (simplified):
1. Client → Server: "Hello, I support TLS 1.3, here are my cipher suites"
2. Server → Client: Certificate (with public key) + chosen cipher suite
3. Client: verifies certificate against trusted CA (Certificate Authority)
4. Client + Server: use asymmetric crypto to agree on a shared symmetric session key
5. All subsequent communication: encrypted with symmetric session key (fast)

WHY TLS 1.3 SPECIFICALLY:
TLS 1.2 weaknesses:
• Supports older, weak cipher suites (RC4, DES, 3DES) — negotiation can be downgraded by attacker
• RSA key exchange: if private key is compromised, past sessions can be decrypted (no forward secrecy)
• More round trips for handshake (adds latency)

TLS 1.3 improvements:
• Removed all weak cipher suites — only AEAD ciphers allowed (AES-GCM, ChaCha20-Poly1305)
• Perfect Forward Secrecy mandatory: each session uses ephemeral keys → compromise of server key doesn't expose past sessions
• Faster: 1-RTT handshake (vs 2-RTT in 1.2), 0-RTT resumption for returning clients
• Simpler: fewer attack surfaces, smaller attack surface

BANKING REQUIREMENTS:
• PCI-DSS v4.0: minimum TLS 1.2, strongly recommends 1.3. Prohibits SSL, TLS 1.0, TLS 1.1.
• RBI IT Framework: encrypted channels for all customer data transmission
• mTLS (Mutual TLS): both client AND server present certificates — used for internal service-to-service. Ensures only authorised services can call each other.

CERTIFICATE MANAGEMENT IN BANKING:
• Certificates expire (typically 1-2 years) — must track and renew
• Automate with Let's Encrypt or internal PKI — manual renewal is a risk (missed renewal = outage)
• Certificate pinning in mobile banking apps: app only trusts specific certificate → prevents MITM even with rogue CA` },

    { level:"Basic", q:"What is OWASP Top 10? Which are most relevant for banking APIs?",
      a:`OWASP (Open Web Application Security Project) Top 10 is the standard reference for critical web application security risks.

MOST CRITICAL FOR BANKING APIs:

#1 BROKEN ACCESS CONTROL:
User accesses another user's account. Customer A calls GET /accounts/12345 where 12345 belongs to Customer B.
Prevention: validate that authenticated user owns or has permission for the requested resource on EVERY request. Never trust client-supplied account IDs without verification.

#2 CRYPTOGRAPHIC FAILURES:
Sensitive data transmitted or stored without encryption. PAN stored in plain text, API using HTTP not HTTPS.
Banking impact: immediate PCI-DSS breach. Criminal liability.

#3 INJECTION (SQL, NoSQL, Command):
Covered separately. Parameterised queries prevent SQL injection.

#4 INSECURE DESIGN:
Architecture-level flaws — no rate limiting, no fraud detection, no idempotency. Not fixable by adding security patches later — must be designed in.
Banking: design payment APIs with idempotency, rate limiting, maker-checker from the start.

#5 SECURITY MISCONFIGURATION:
Default passwords, unnecessary endpoints exposed, debug mode in production, verbose error messages revealing internal details.
Banking: "account not found" not "PostgreSQL error: no rows in result set for query SELECT * FROM accounts..." — error messages must never reveal internals.

#7 IDENTIFICATION AND AUTHENTICATION FAILURES:
Weak password policies, no MFA, session tokens not expiring, predictable session IDs.
Banking standard: MFA mandatory for all financial transactions, session timeout after inactivity, tokens invalidated on logout.

#8 SOFTWARE AND DATA INTEGRITY FAILURES:
Using unverified dependencies, insecure CI/CD pipeline, auto-update mechanisms that can be hijacked.
Banking: dependency scanning in CI/CD, signed artifacts, verified deployment pipelines.

#9 SECURITY LOGGING AND MONITORING FAILURES:
No alerting on authentication failures, no audit logging of sensitive operations.
Banking: log ALL access to financial data, alert on > 5 auth failures in 1 minute, SIEM integration.

BANKING ADDITIONS (not in OWASP but critical):
• Business logic attacks: valid individual requests combined to exploit business logic (e.g., exploiting rounding in interest calculations)
• API enumeration: guessing account numbers from sequential IDs` },

    // INTERMEDIATE SEC
    { level:"Intermediate", q:"What are the key PCI-DSS v4.0 requirements that impact system architecture?",
      a:`PCI-DSS (Payment Card Industry Data Security Standard) v4.0 has 12 requirements. Key architecture impacts:

REQUIREMENT 1 — NETWORK SECURITY:
Define Cardholder Data Environment (CDE) — the network zone where card data lives.
Architecture: separate VPC/VLAN for CDE. Strict security groups — only necessary ports. No direct internet access to CDE. All traffic through WAF.
Design: card data must never leave CDE unencrypted. API gateway sits outside CDE, calls CDE services via private network.

REQUIREMENT 3 — PROTECT STORED ACCOUNT DATA:
NEVER store: CVV/CVC (3-4 digit security code), full magnetic stripe data, PIN block.
PAN (card number) must be masked in all displays (show only last 4 digits), logs, reports.
Architecture: tokenisation service — replace PAN with token. Token used throughout your system. Original PAN only at vault (your tokenisation provider or PCI-compliant HSM).

REQUIREMENT 4 — ENCRYPT IN TRANSIT:
TLS 1.2 minimum (1.3 preferred) for all cardholder data transmission.
mTLS between all services within CDE.
Certificate pinning for mobile apps handling card data.

REQUIREMENT 6 — SECURE DEVELOPMENT:
SAST (static analysis) in CI/CD — SonarQube with security rules.
DAST (dynamic analysis) — OWASP ZAP in staging pipeline.
Vulnerability scanning: all containers and dependencies before deployment.
Penetration testing: annually AND after significant changes.

REQUIREMENT 8 — STRONG AUTHENTICATION:
MFA for ALL access to CDE (developers, ops, everyone).
No shared accounts in CDE — every person has unique credentials.
Service accounts: use certificates or managed identities, not passwords where possible.

REQUIREMENT 10 — LOGGING:
ALL access to cardholder data must be logged with: who, what, when, from where.
Logs retained: 12 months total, 3 months immediately available.
Architecture: centralised SIEM (Security Information and Event Management). Tamper-evident log storage — logs can't be modified even by admins.

REQUIREMENT 12 — RISK MANAGEMENT:
Annual risk assessment. Incident response plan tested annually.
Architecture: data flow diagrams showing all cardholder data flows, maintained as living documentation, reviewed after any system change.` },

    { level:"Intermediate", q:"How do you implement role-based access control (RBAC) in a banking system?",
      a:`RBAC assigns permissions to roles, and roles to users. Users get permissions through their role assignment — not directly.

SCHEMA DESIGN:
CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,     -- TELLER, BRANCH_MANAGER, COMPLIANCE_OFFICER
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE permissions (
  id BIGSERIAL PRIMARY KEY,
  resource VARCHAR(100) NOT NULL,       -- ACCOUNT, TRANSACTION, LOAN, REPORT
  action VARCHAR(50) NOT NULL,          -- VIEW, CREATE, APPROVE, REJECT, EXPORT
  description TEXT,
  UNIQUE(resource, action)
);

CREATE TABLE role_permissions (
  role_id BIGINT REFERENCES roles(id),
  permission_id BIGINT REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id BIGINT REFERENCES users(id),
  role_id BIGINT REFERENCES roles(id),
  assigned_by BIGINT REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,                 -- time-bound role assignment
  PRIMARY KEY (user_id, role_id)
);

BANKING ROLES EXAMPLE:
• TELLER: VIEW_ACCOUNT, CREATE_CASH_TRANSACTION, PRINT_STATEMENT
• BRANCH_MANAGER: all teller permissions + APPROVE_TRANSACTION (up to ₹5L) + VIEW_ALL_BRANCH_ACCOUNTS
• COMPLIANCE_OFFICER: VIEW_ALL_ACCOUNTS, EXPORT_AML_REPORT, VIEW_AUDIT_LOG (no transaction creation)
• SYSTEM_ADMIN: user management only, NO financial permissions (segregation of duties)

ENFORCEMENT:
// Spring Security example
@PreAuthorize("hasPermission('TRANSACTION', 'APPROVE')")
public ResponseEntity<Transaction> approveTransaction(@PathVariable UUID id) { ... }

// Or check in service layer:
if (!permissionService.hasPermission(currentUser, "TRANSACTION", "APPROVE")) {
    throw new AccessDeniedException("Insufficient permissions");
}

IMPORTANT BANKING CONTROLS:
• Segregation of Duties: user who creates a transaction cannot approve it (maker-checker)
• Least Privilege: grant minimum permissions needed for the role
• Time-bound roles: contract employees get roles with expiry date
• Regular access review: quarterly review of all role assignments (RBI requirement)
• Audit: every permission check logged — who tried to do what and whether it was allowed` },

    { level:"Intermediate", q:"What is a Web Application Firewall (WAF)? How do you configure it for banking?",
      a:`A WAF inspects HTTP/HTTPS traffic between clients and web applications, blocking requests that match known attack patterns.

WHAT WAF PROTECTS AGAINST:
• SQL injection in API parameters
• Cross-Site Scripting (XSS)
• Cross-Site Request Forgery (CSRF)
• HTTP protocol attacks (malformed requests, header injection)
• Known vulnerability exploitation (CVE-based signatures)
• DDoS at application layer (L7)
• API abuse (unusual request patterns)

WAF MODES:
Detection mode: logs suspicious requests but doesn't block — use during initial deployment to tune rules without breaking legitimate traffic.
Prevention mode: actively blocks suspicious requests — use in production after tuning.

BANKING WAF CONFIGURATION:

CORE RULE SETS:
• OWASP Core Rule Set (CRS): comprehensive rules for OWASP Top 10 — enable all
• Custom rules for banking:
  - Block requests with account numbers in URL parameters (should be in body or path variables)
  - Rate limit: > 100 requests/minute per IP to /api/payments → block
  - Geo-blocking: block IP ranges from high-risk countries (unless bank operates there)
  - User-agent blocking: block known vulnerability scanner user agents

API-SPECIFIC RULES:
• Schema validation: enforce API contract — reject requests with unexpected fields or wrong types
• Size limits: request body > 1MB for a payment API → suspicious, block
• Method enforcement: POST /payments must be POST, not GET. GET /accounts must be GET.

FALSE POSITIVE MANAGEMENT (critical):
Banking APIs often have legitimate requests that look suspicious to WAF (complex JSON, special characters in names).
Process: detection mode for 2 weeks → review false positives → whitelist legitimate patterns → switch to prevention.
Never go straight to prevention mode without tuning.

WAF IN BANKING ARCHITECTURE:
• Placed at: internet-facing API gateway (before reaching application)
• Managed WAF: AWS WAF, Azure Front Door WAF — managed rule updates, less ops overhead
• On-premise: F5 BIG-IP, Imperva — more control, more ops
• WAF logs → SIEM: all blocked requests alerted and reviewed` },

    { level:"Intermediate", q:"Explain data masking and tokenisation. When do you use each in banking?",
      a:`Both protect sensitive data, but serve different purposes.

DATA MASKING: Replacing sensitive data with realistic-looking fake data.
Types:
• Static masking: permanent replacement (for non-production environments)
• Dynamic masking: original stored, masked on display based on user's access level

Examples:
• Account number: 1234567890123456 → XXXX XXXX XXXX 3456
• Aadhaar: 1234 5678 9012 → XXXX XXXX 9012  
• PAN: ABCDE1234F → ABCDE****F
• Name: "Prakash Kumar" → "P****h K****r"
• Phone: 9876543210 → 98XXXXX210

USE MASKING FOR:
• Display in UI: show masked account number to customer (they know their own account, just need partial confirmation)
• Non-production environments: copy production data to staging but mask PII — developers see realistic data structure without real customer data
• Audit logs: log transaction details but mask card number and Aadhaar
• Support team screens: teller sees masked card number (they don't need full number)

TOKENISATION: Replacing sensitive data with a non-sensitive placeholder (token). Token can be reversed to original only by the token vault.

Example:
• Card number 4532015112830366 → Token: tok_8f7d2a1b9c3e4f5a
• Token stored everywhere in your systems
• Original card number stored only in PCI-compliant vault (Vault by HashiCorp, Basis Theory, etc.)
• When you need to process a payment: send token to vault → vault retrieves real card number → sends to card network directly (your system never touches real number again)

USE TOKENISATION FOR:
• Card numbers: never store in your DB — tokenise at point of entry
• Bank account numbers for recurring NACH: tokenise
• Aadhaar for recurring KYC checks: UIDAI requires VID (Virtual ID) usage — Aadhaar's own tokenisation

KEY DIFFERENCE:
Masking: one-way (cannot recover original from masked value — used for display only)
Tokenisation: reversible (can get original from vault when needed for processing)
Encryption: also reversible but you hold the key — key management is your problem. Tokenisation offloads this to vault.` },

    { level:"Advanced", q:"Design a secrets management system for a banking microservices environment.",
      a:`Secrets management handles: DB passwords, API keys, certificates, encryption keys — ensuring they're never hardcoded, always rotated, access is audited.

THE PROBLEM at scale:
50 microservices. Each needs: DB password, 3 external API keys, TLS certificate, encryption key.
That's 250+ secrets. Manual rotation of each every 90 days = 1,000 rotation events per year.
One hardcoded secret in Git = permanent breach risk.

SOLUTION: HashiCorp Vault (or AWS Secrets Manager)

VAULT ARCHITECTURE:
• 3-node Vault cluster (HA) in dedicated security zone
• Backed by: integrated Raft storage (no external Consul needed in Vault 1.4+)
• Auto-unsealing: AWS KMS or cloud HSM (not manual unseal in production)
• Secrets organised: secret/banking-prod/payment-service/db-creds

SERVICE AUTHENTICATION TO VAULT:
In Kubernetes (recommended):
• Each pod has a Kubernetes Service Account
• Vault's Kubernetes auth: pod sends SA token to Vault, Vault validates with K8s API
• Vault returns short-lived Vault token (15 min - 1 hr TTL)
• Vault Agent sidecar: handles auth and token renewal automatically

SECRET RETRIEVAL PATTERN:
• Vault Agent sidecar runs alongside each pod
• Agent authenticates to Vault on pod startup
• Writes secrets to shared memory volume (tmpfs — never touches disk)
• Application reads secrets from memory volume
• Agent refreshes secrets before expiry — zero-downtime rotation

DYNAMIC SECRETS (most powerful feature):
Vault generates DB credentials ON DEMAND:
• When payment-service pod starts, Vault creates a PostgreSQL user specifically for this pod:
  username: v-payment-service-pod-abc123
  password: generated-random-string
  TTL: 1 hour (or pod lifetime)
• When pod dies: Vault revokes those DB credentials
• Benefits: each pod has unique credentials; compromise of one pod doesn't expose all others; credentials auto-expire

CERTIFICATE MANAGEMENT:
• Vault PKI engine: internal CA
• Issue short-lived certificates (24 hours) for each service
• Cert renews automatically via Vault Agent
• No long-lived certificates to steal

AUDIT LOG:
• Every secret access logged: which service, which secret, when, from which IP
• Log stream to SIEM
• Anomaly: payment-service accessing fraud-service secrets → immediate alert

EMERGENCY ROTATION:
• Credential leak detected → revoke in Vault immediately
• Dynamic secrets: Vault auto-issues new credentials → pods pick up within seconds
• Static secrets (API keys): rotate in Vault → Vault Agent pushes new value → app reloads config
• Total time from detection to new credentials: < 5 minutes` },

    { level:"Advanced", q:"How do you implement audit logging that satisfies RBI requirements?",
      a:`RBI IT Framework mandates: comprehensive audit trails for all critical operations, retained for minimum 8 years, tamper-proof, searchable.

WHAT MUST BE LOGGED:
• All logins (success and failure) — who, when, from where
• All access to customer financial data — who viewed whose account
• All financial transactions — creation, approval, execution, reversal
• All configuration changes — who changed what setting, when
• All user/role management changes — who granted access to whom
• All failed authorisation attempts
• All data exports and report generations

AUDIT LOG SCHEMA:
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  event_type VARCHAR(100) NOT NULL,        -- LOGIN_SUCCESS, ACCOUNT_VIEWED, PAYMENT_CREATED
  actor_id VARCHAR(100) NOT NULL,          -- user_id or service_id performing action
  actor_type VARCHAR(20) NOT NULL,         -- HUMAN, SERVICE, SYSTEM
  actor_ip INET,
  actor_session_id VARCHAR(100),
  resource_type VARCHAR(100),              -- ACCOUNT, TRANSACTION, USER
  resource_id VARCHAR(100),               -- ID of affected resource
  action VARCHAR(50) NOT NULL,            -- VIEW, CREATE, APPROVE, DELETE
  outcome VARCHAR(20) NOT NULL,           -- SUCCESS, FAILURE, DENIED
  old_value JSONB,                        -- previous state (for updates)
  new_value JSONB,                        -- new state (for creates/updates)
  failure_reason TEXT,
  request_id UUID,                        -- correlates to API request / trace
  additional_context JSONB               -- event-specific extra data
);

IMMUTABILITY ENFORCEMENT:
• Application DB user: only INSERT privilege on audit_events. NO UPDATE, DELETE.
• REVOKE UPDATE ON audit_events FROM app_user;
• REVOKE DELETE ON audit_events FROM app_user;
• Even DBAs shouldn't modify — separate audit DB with different credentials

TAMPER DETECTION:
Hash chain: each record includes hash of previous record.
hash = SHA256(previous_hash || event_time || event_type || actor_id || resource_id || action)
Stored in audit_events.record_hash column.
Nightly batch: recompute hash chain, alert if any hash doesn't match.
Compliance: if any record is deleted or modified, hash chain breaks — detectable.

CENTRALISED COLLECTION:
• All services write audit events to Kafka topic: banking.audit.events
• Audit consumer: reads from Kafka, writes to audit DB (append-only)
• Kafka acts as buffer — if audit DB is briefly unavailable, events queue in Kafka, no loss
• CDC from audit DB → cold storage (S3 Glacier) for records > 2 years old

SEARCHING (operational need):
• Elasticsearch index for recent 2 years (full-text search, fast queries)
• Compliance query: "all access to customer 12345's account in Q3 2023" → Elasticsearch
• Deep history: query S3 with Athena for records > 2 years
• Access to audit search: restricted to compliance team and auditors only (separate role)

PERFORMANCE:
• Audit writes must not slow down business transactions
• Write audit to Kafka synchronously (fast), consume and persist asynchronously
• If Kafka is unavailable: write directly to audit DB as fallback (never drop audit events)` },

    { level:"Expert", q:"How do you design a zero-trust security architecture for a banking platform?",
      a:`Zero Trust: "Never trust, always verify." No implicit trust based on network location. Every request is authenticated, authorised, and encrypted regardless of where it comes from — even inside the private network.

WHY ZERO TRUST IN BANKING:
• Traditional perimeter security: firewall protects the perimeter; everything inside is trusted.
• Problem: insider threat (trusted employee misusing access), compromised internal machine, vendor access.
• Zero Trust: even if attacker is inside the network, they can't move laterally without authentication.

ZERO TRUST PRINCIPLES:

1. VERIFY EXPLICITLY:
Every API call — internal or external — requires authentication.
No "trusted internal caller" exceptions.
JWT or mTLS for every service-to-service call.
In Kubernetes: Istio service mesh enforces mTLS between all pods automatically — service A can only call service B if A has a valid certificate and is authorised for B's API.

2. LEAST PRIVILEGE ACCESS:
Payment service can call Account service (read balance + debit/credit).
Payment service CANNOT call User Management service.
Fraud service can read transactions but not create them.
Enforce at: service mesh policy level (Istio AuthorizationPolicy), not just application code.

3. ASSUME BREACH:
Design assuming an attacker is already inside.
• Micro-segmentation: each service in its own network segment; can only communicate with explicitly allowed services
• Audit everything: every inter-service call logged
• Detect lateral movement: anomaly detection on service call patterns

IMPLEMENTATION LAYERS:

IDENTITY LAYER:
• Every service has a cryptographic identity (X.509 certificate issued by Vault PKI)
• Certificates rotated every 24 hours
• SPIFFE/SPIRE: standard for service identity in Kubernetes environments

NETWORK LAYER (Istio Service Mesh):
• mTLS: mutual authentication between all services — both prove identity
• Encryption: all traffic encrypted in transit (even within cluster)
• Policy: Istio AuthorizationPolicy defines which service can call which service, which methods
• No policy = deny by default

POLICY LAYER (OPA — Open Policy Agent):
• Centralised policy engine
• Policies written in Rego language, managed as code
• Example policy: "payment-service can call account-service's /debit endpoint, but only if request amount is within payment-service's authorised limit"
• Policies versioned, reviewed, deployed like code

OBSERVABILITY FOR ZERO TRUST:
• Every denied request logged with: source, destination, reason
• Dashboard: inter-service communication map — visualise what's calling what
• Anomaly: service X suddenly calling service Y which it never called before → alert

HUMAN ACCESS ZERO TRUST:
• No direct SSH to production servers — bastion host with MFA, session recording
• Just-in-time access: request elevated access for specific task, auto-expires after N hours
• All production access recorded and reviewable` },

    { level:"Expert", q:"What is a penetration test? How do you manage vulnerability disclosure in banking?",
      a:`Penetration testing (pen test) is authorised simulated attack on your systems to identify vulnerabilities before real attackers do.

TYPES:

BLACK BOX: Tester has no prior knowledge of system. Simulates external attacker.
Use: annual external pen test of public-facing banking APIs.

WHITE BOX: Tester has full access — code, architecture, credentials. Deepest assessment.
Use: pre-launch assessment of new core banking component. Developer accompanies tester.

GREY BOX: Partial knowledge — authenticated user credentials, API documentation. Most realistic.
Use: quarterly internal application pen test — simulates compromised employee or stolen customer credentials.

BANKING PEN TEST SCOPE:
• External: internet-facing APIs, mobile banking app, web portal
• Internal: core banking integration, inter-service communication
• Social engineering: phishing test of bank employees (with HR approval)
• Physical: data centre access controls (with physical security team)

PEN TEST PROCESS:
1. SCOPING: define what's in scope, what's out. Written authorisation essential — pen testing without it is illegal.
2. RECONNAISSANCE: passive (OSINT — what's publicly known about target?) and active (port scanning, service enumeration)
3. VULNERABILITY SCANNING: automated scan for known vulnerabilities (Nessus, Qualys)
4. EXPLOITATION: attempt to exploit discovered vulnerabilities
5. POST-EXPLOITATION: if compromised, how far can attacker move? (lateral movement)
6. REPORTING: findings with CVSS severity scores, evidence, remediation guidance

CVSS SCORING:
Critical (9.0-10.0): patch immediately, notify regulators if customer data at risk
High (7.0-8.9): patch within 30 days
Medium (4.0-6.9): patch within 90 days
Low (0.1-3.9): address in next release cycle

VULNERABILITY DISCLOSURE PROGRAMME:
• Responsible disclosure policy: published on bank website
• Security researchers who find vulnerabilities can report them without legal threat
• Response SLA: acknowledge within 48 hours, fix Critical within 15 days
• Bug bounty: optional payment for valid findings (₹10,000-₹5,00,000 depending on severity)
• Hall of fame: recognise researchers publicly (with their consent)

RBI REQUIREMENTS:
• Annual pen test mandatory (RBI IT Framework)
• After major system changes: pen test before go-live
• Critical/High findings: report to board-level risk committee
• CSITE notification: if pen test reveals actual compromise or data exposure` },
  ]
};

const DOMAIN_MSG = {
  id: "msg", title: "Messaging & Events", icon: "📨", color: "#22c55e",
  qa: [
    { level:"Basic", q:"What is Apache Kafka? Why is it used over traditional message queues in banking?",
      a:`Kafka is a distributed event streaming platform — a highly durable, ordered, replayable log. Unlike queues (RabbitMQ), Kafka retains messages even after consumption.

WHY KAFKA OVER QUEUES IN BANKING:

DURABILITY: Kafka persists to disk and replicates. Queues lose messages if broker crashes before delivery. In banking, losing a payment event is unacceptable.

REPLAY: Kafka lets consumers re-read past events. Fraud detection service was down 2 hours? Replay those transactions. Queue already deleted those messages.

MULTIPLE CONSUMERS: Multiple services independently consume the same topic — payment processor, fraud detection, audit, notification — all read the same PAYMENT_CREATED event without competing. Queues deliver each message to only one consumer.

ORDERING: Guaranteed ordering within a partition. Partitioning by account_id guarantees ordered processing per account.

THROUGHPUT: Millions of events/second. Queues bottleneck at tens of thousands.

AUDIT: Kafka retains all events (configurable retention — can be forever). Complete immutable event history for RBI compliance.

WHEN QUEUES ARE STILL APPROPRIATE:
• Simple task distribution (send email, generate report)
• Request-reply pattern (Kafka doesn't natively support)
• Small scale where Kafka's operational complexity isn't justified
• Dead simple pub-sub with no replay requirement` },

    { level:"Basic", q:"What is a message topic, partition, and offset in Kafka?",
      a:`TOPIC: A named category of messages. Like a database table for events.
Examples: payment.transactions, account.events, fraud.alerts
Producers publish to topics. Consumers subscribe to topics.

PARTITION: A topic is split into N partitions. Each partition is an ordered, append-only log stored on a specific broker. Partitions enable parallelism — N partitions can be processed by N consumers simultaneously.

Partition assignment: hash(message_key) % num_partitions determines which partition a message goes to.
In banking: use account_id as key → all events for same account go to same partition → processed in order.

OFFSET: Each message in a partition has a unique, incrementing offset number. The consumer's "cursor" position — which message it last processed.

If a consumer processes up to offset 5000 and crashes, it resumes from 5000 on restart. No messages lost or skipped. Offsets stored in Kafka's __consumer_offsets internal topic.

VISUAL:
Topic: payment.transactions
Partition 0: [0: PAY001] [1: PAY002] [2: PAY003] ...
Partition 1: [0: PAY100] [1: PAY101] ...
Partition 2: [0: PAY200] [1: PAY201] ...

Consumer A: processing Partition 0, currently at offset 2
Consumer B: processing Partition 1, currently at offset 1
Consumer C: processing Partition 2, currently at offset 0

CONSUMER GROUP: Group of consumers sharing load across partitions.
Each partition assigned to exactly one consumer in the group.
10 partitions, 10 consumers → each processes 1 partition (maximum parallelism).
5 consumers → some consumers handle 2 partitions each.
20 consumers → 10 consumers idle (more consumers than partitions = wasteful).` },

    { level:"Basic", q:"What is a producer and consumer in Kafka? How do they work?",
      a:`PRODUCER: Application that publishes (writes) messages to Kafka topics.

Key producer configurations:
• acks: 0 (fire and forget), 1 (leader acknowledged), all (all replicas acknowledged — use for banking)
• enable.idempotence: true — prevents duplicate messages on retry
• retries: number of retry attempts on failure
• key: determines partition. Use account_id for ordering per account.

Java example:
ProducerRecord<String, PaymentEvent> record = new ProducerRecord<>(
    "payment.transactions",   // topic
    payment.getAccountId(),   // key (determines partition)
    paymentEvent              // value
);
producer.send(record);

CONSUMER: Application that reads (consumes) messages from Kafka topics.

Key consumer configurations:
• group.id: consumer group name — all instances with same group.id share load
• auto.offset.reset: earliest (read from beginning) or latest (only new messages)
• enable.auto.commit: false in banking — manually commit after successful processing
• max.poll.records: how many records per poll

Java example:
consumer.subscribe(List.of("payment.transactions"));
while (true) {
    ConsumerRecords<String, PaymentEvent> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, PaymentEvent> record : records) {
        processPayment(record.value());  // your business logic
    }
    consumer.commitSync();  // commit AFTER successful processing
}

MANUAL COMMIT IMPORTANCE IN BANKING:
If auto-commit is on: offset committed before processing completes → crash during processing → message lost.
Manual commit: process → then commit → crash before commit → reprocesses (at-least-once) → idempotent handler handles duplicate safely.
Always prefer at-least-once delivery with idempotent processing over at-most-once in banking.` },

    { level:"Basic", q:"What is event sourcing? How does it benefit banking systems?",
      a:`Event sourcing stores the HISTORY OF CHANGES as a sequence of events, rather than storing only the current state.

TRADITIONAL (store current state):
accounts table: { id: 123, balance: 45000, last_updated: ... }
Problem: how did balance become 45000? History lost unless you maintain a separate audit table.

EVENT SOURCING (store all events):
account_events table:
{ event: "ACCOUNT_OPENED", amount: 10000, timestamp: ... }
{ event: "DEPOSIT", amount: 50000, timestamp: ... }
{ event: "WITHDRAWAL", amount: 15000, timestamp: ... }

Current balance = 10000 + 50000 - 15000 = 45000 (derived by replaying events)

BANKING BENEFITS:

COMPLETE AUDIT TRAIL BUILT-IN:
Every transaction, every state change, is an immutable event. No separate audit table needed. RBI compliance is natural — you have the complete history of every account.

TEMPORAL QUERIES:
"What was this account's balance on March 15, 2023?" 
→ Replay all events up to that date → exact answer.
Impossible with state-only storage.

BUG FIX:
Discovered a bug that incorrectly calculated interest for 3 months?
Fix the bug, replay all events from before the bug period → correct state reconstructed.

READ MODEL FLEXIBILITY:
Build any read model from the event stream.
Need a new report format? Write a new consumer that builds a new read model from existing events. No data migration.

CHALLENGES:
• Event schema evolution: changing event format when events stored forever — requires versioning strategy
• Performance: replaying millions of events to get current state → snapshots needed (periodically store current state, only replay events after snapshot)
• Eventual consistency between event store and read models

BANKING USE: Core banking ledger is naturally event-sourced (journal entries are the events). Payments, account changes benefit similarly.` },

    { level:"Intermediate", q:"What are Kafka consumer groups? How do they enable parallel processing?",
      a:`A consumer group is a set of consumers that collectively consume a topic. Each partition is assigned to exactly one consumer in the group at a time.

PARALLEL PROCESSING MECHANICS:
Topic: payment.events, 20 partitions
Consumer group: fraud_detection with 10 pods
→ Each pod processes 2 partitions
→ 10 threads processing in parallel

Scale to 20 pods → each pod handles 1 partition → 2x throughput
Scale to > 20 pods → excess pods are idle (can't have more active consumers than partitions)
Scale down to 5 pods → each pod handles 4 partitions (rebalancing)

REBALANCING:
When pods join/leave the group: Kafka triggers a rebalance. Partitions reassigned across active consumers.
During rebalance: brief processing pause (all consumers stop, partitions reassigned, processing resumes).
Cooperative rebalancing (Kafka 2.4+): only affected partitions are reassigned — less disruption.

INDEPENDENT CONSUMER GROUPS:
Multiple groups can consume the same topic independently.
• fraud_detection group: reads payment.events (at its own pace)
• audit_logger group: reads payment.events (at its own pace)
• notification_service group: reads payment.events

Each group has its own offset tracking. One group falling behind doesn't affect others.
This is the key advantage over traditional queues: multiple independent consumers, no coordination needed.

OFFSET MANAGEMENT PER GROUP:
Each group maintains its own offsets in __consumer_offsets.
If audit_logger is slow (1 hour behind): it processes at its own pace.
fraud_detection (real-time) is unaffected.
notification_service is unaffected.

BANKING DESIGN:
• payment.transactions topic: consumed by fraud_detection group, notification group, ledger_posting group, audit group independently
• Each service team owns their consumer group — no cross-team coordination for processing
• Monitor: consumer lag per group — alert if fraud_detection group is > 30 seconds behind` },

    { level:"Intermediate", q:"What is the difference between at-most-once, at-least-once, and exactly-once delivery?",
      a:`These describe how many times a message is delivered to a consumer.

AT-MOST-ONCE (fire and forget):
Offset committed BEFORE processing. If crash occurs during processing: offset already committed, message won't be reprocessed → message is LOST.
Use case: metrics, analytics, non-critical notifications — losing a few is acceptable.
Never use for financial transactions.

AT-LEAST-ONCE (default Kafka behaviour):
Offset committed AFTER processing. If crash after processing but before commit: message reprocessed on restart → potential DUPLICATE processing.
Requires: idempotent consumers — handle duplicates gracefully.
Use case: most banking operations — accept the possibility of reprocessing if idempotency handled.

EXACTLY-ONCE (hardest to achieve):
Message processed exactly once — no loss, no duplicate.
Two mechanisms in Kafka:
1. Idempotent producer: Kafka deduplicates producer retries (prevents duplicate messages in Kafka)
2. Kafka Transactions: atomic write across multiple topics/partitions
   producer.beginTransaction()
   producer.send(output_topic, result)
   consumer.commitSync(offsets)  // commit offset as part of same transaction
   producer.commitTransaction()
   → Either both output write AND offset commit happen, or neither.

EXACTLY-ONCE TO EXTERNAL SYSTEMS (e.g., DB):
True exactly-once isn't achievable with external DB without special handling.
Pattern: read event → process → write to DB AND write processed offset to DB in same DB transaction.
On restart: read offset from DB, seek Kafka consumer to that offset → never reprocess committed records.

BANKING RECOMMENDATION:
• Use at-least-once + idempotent consumers (check idempotency key before processing).
• This achieves same result as exactly-once with less complexity.
• True Kafka transactions: use when output goes back to Kafka (e.g., from input topic to result topic).` },

    { level:"Intermediate", q:"What is a Kafka consumer lag and why does it matter in banking?",
      a:`Consumer lag = number of messages that have been published to a Kafka topic but not yet processed by a consumer group.

Lag = Latest offset (head of partition) - Consumer's committed offset

Example:
• payment.transactions partition 3: latest offset = 50,000
• fraud_detection group's committed offset for partition 3 = 49,500
• Lag = 500 messages (500 unprocessed payments for fraud checking)

WHY IT MATTERS IN BANKING:

REAL-TIME FRAUD DETECTION:
If fraud detection lag is 10,000 messages and processing at 1,000 messages/minute → fraud detection is 10 minutes behind.
A fraud transaction processed 10 minutes later is too late — money already transferred.
SLA: fraud detection consumer must have lag < 30 seconds under normal load.

NOTIFICATION DELAYS:
Lag in notification service → customer doesn't receive payment confirmation for minutes.
Acceptable lag for notifications: up to 60 seconds.

AUDIT LOG:
Lag in audit consumer → recent transactions not yet in audit log → compliance risk.
If regulator requests immediate audit of last 5 minutes, lag means incomplete data.

SYSTEM HEALTH INDICATOR:
Increasing lag = consumer can't keep up with producer throughput.
Causes: consumer too slow, downstream DB too slow, consumer died (all lag on remaining consumers).
Spike in lag with quick recovery = brief outage. Continuously growing lag = systemic issue.

MONITORING:
• Kafka's built-in metrics: kafka.consumer_group.lag (per group per topic per partition)
• Tools: Burrow (LinkedIn's consumer lag monitor), Prometheus JMX exporter + Grafana
• Alerts:
  - fraud_detection lag > 100 → warning
  - fraud_detection lag > 1,000 → critical PagerDuty alert
  - audit_logger lag > 10,000 → warning (less time-critical)

REMEDIATION:
Lag increasing → scale up consumer pods (add more pods, up to number of partitions)
Lag not recovering with more pods → downstream bottleneck (DB write too slow) → fix downstream
Lag spike: single consumer died → rebalancing resolves within 30 seconds automatically` },

    { level:"Advanced", q:"How do you handle schema evolution in Kafka for banking events?",
      a:`Schema evolution = changing the structure of Kafka messages over time without breaking existing consumers.

THE PROBLEM:
PaymentEvent v1: { payment_id, amount, account_id }
You need to add: currency, merchant_id
PaymentEvent v2: { payment_id, amount, account_id, currency, merchant_id }

If producer sends v2 but consumer expects v1 → deserialization error → consumer crashes.
If you run both v1 (old services) and v2 (new services) consumers → schema mismatch.

SOLUTION: Schema Registry + Avro (or Protobuf)

SCHEMA REGISTRY (Confluent Schema Registry):
• Central repository for all message schemas
• Producer registers schema before publishing — gets schema ID
• Producer serialises message: [magic byte][schema_id][avro_bytes]
• Consumer fetches schema by ID from registry before deserialising

AVRO SCHEMA EVOLUTION RULES:
BACKWARD COMPATIBLE (new schema can read old data):
• Add optional fields with defaults: adding currency with default "INR" → old messages without currency field are read with default "INR" ✓
• Remove required fields (only if consumers don't use them)

FORWARD COMPATIBLE (old schema can read new data):
• Old consumer ignores unknown fields
• New fields must have defaults

FULL COMPATIBILITY (both):
• Only add optional fields with defaults
• Never remove, rename, or change type of existing fields

BANKING SCHEMA EVOLUTION WORKFLOW:
1. Developer proposes schema change (adds currency field with default)
2. Register new schema in Schema Registry → registry validates compatibility against previous version
3. If compatibility check PASSES: schema registered as v2, gets new schema ID
4. If FAILS: rejected — must make backward-compatible change
5. Deploy consumers that understand v2 FIRST (they can read both v1 and v2)
6. Deploy producers that publish v2

VERSIONING STRATEGY:
• Never delete old schema versions while old consumers exist
• Maintain schema changelog in version control
• Consumer compatibility matrix: which consumer version supports which schema version

PROTOBUF ALTERNATIVE:
• Google Protocol Buffers: binary, typed, built-in evolution support (field numbers, not names)
• Better for polyglot environments (Java, Python, Go consumers)
• gRPC natively uses Protobuf — good if you have both gRPC and Kafka` },

    { level:"Advanced", q:"Design an event-driven notification system for a banking platform.",
      a:`Notification system must deliver: payment confirmations, OTPs, fraud alerts, statement alerts — reliably, at scale, across multiple channels (SMS, push, email, WhatsApp).

ARCHITECTURE:

EVENT SOURCES → KAFKA:
All bank services publish events to Kafka:
• payment.completed → trigger payment confirmation
• fraud.alert.raised → trigger immediate fraud alert
• account.statement.ready → trigger statement notification
• otp.requested → trigger OTP delivery

NOTIFICATION ORCHESTRATOR (Kafka Consumer):
• Subscribes to all notification-triggering topics
• Determines: which notification to send, which channel, which template
• Applies preferences: customer opted out of email? Skip email channel.
• Priority routing: OTP and fraud alerts → high-priority queue; marketing → low-priority

CHANNEL HANDLERS (separate services per channel):

SMS Handler:
• Integrated with primary SMS provider (Kaleyra, MSG91) + fallback (Twilio)
• SMS must go through DLT (Distributed Ledger Technology) for transactional templates (TRAI mandate)
• Template: "Your account XX1234 debited INR 5,000. Balance: INR 45,000. Ref: TXN123"
• Delivery receipt: provider sends callback on delivery/failure

PUSH NOTIFICATION Handler:
• Firebase Cloud Messaging (FCM) for Android, APNs for iOS
• Device token management: store and rotate device tokens per customer per device
• Rich push for payment confirmation: amount, merchant name, balance

EMAIL Handler:
• AWS SES or SendGrid
• HTML templates with bank branding
• Attachment: account statement PDF for statement notifications

WHATSAPP Handler:
• WhatsApp Business API (via approved BSP — Business Solution Provider)
• Template messages only for transactional notifications (Meta approval required per template)

RELIABILITY:

OTP (critical — must deliver within 30 seconds or customer can't complete transaction):
• Synchronous delivery attempt to primary SMS provider
• If failure within 5 seconds: immediate fallback to secondary provider
• DLT-compliant template pre-approved
• Monitor: delivery rate per provider, switch primary if rate drops below 95%

Payment confirmation (important but not critical):
• Asynchronous delivery
• Retry on failure: 3 attempts with 1min, 5min, 15min backoff
• Dead letter queue: if all retries fail → operations team alert
• At-least-once delivery: idempotent — resending "payment confirmed" twice is acceptable (customer sees duplicate, minor annoyance vs missing confirmation)

Fraud alert (urgent):
• Multiple channels simultaneously: SMS + push notification at same time
• No delay — direct to high-priority processing queue
• If no delivery confirmation in 2 minutes: attempt additional channels

AUDIT:
• Every notification attempt logged: channel, template, recipient, timestamp, provider response
• Delivery rate metrics per channel per provider
• Regulatory: all OTPs logged with: requested by whom, delivered to which number, at what time (fraud investigation)` },

    { level:"Expert", q:"How do you implement event sourcing with Kafka for a banking account service?",
      a:`Event sourcing + Kafka: the account's state is derived from a stream of events, with Kafka as the event store.

EVENT TYPES:
AccountOpened { account_id, customer_id, opening_balance, timestamp }
MoneyDeposited { account_id, amount, reference, timestamp }
MoneyWithdrawn { account_id, amount, reference, timestamp }
AccountFrozen { account_id, reason, frozen_by, timestamp }
AccountClosed { account_id, closure_reason, final_balance, timestamp }

KAFKA AS EVENT STORE:
Topic: account.events, partitioned by account_id.
Retention: infinite (log.retention.bytes = -1, log.retention.ms = -1) — this IS the source of truth.
Compaction: NOT enabled for this topic — we need full history, not just latest state.

WRITE FLOW:
1. Command received: WithdrawMoney { account_id: 123, amount: 5000 }
2. Load current state by reading account's events from Kafka (or from snapshot)
3. Validate: sufficient balance?
4. If valid: publish MoneyWithdrawn event to Kafka
5. Event stored in Kafka → durable

The event IS the write. No separate DB write needed.

CURRENT STATE (via Kafka Streams):
Kafka Streams application reads account.events topic:
• Processes each event → maintains account state in a local RocksDB store (per partition)
• State store: KTable keyed by account_id → current account state
• Served via interactive queries: GET /accounts/123 → query local RocksDB

SNAPSHOTTING (performance):
Replaying 10 million events to get current state → slow.
Periodic snapshots: every 1,000 events (or daily), write current state to snapshot table.
On startup: load latest snapshot → replay only events after snapshot offset.
Snapshot stored in PostgreSQL with: account_id, state_json, last_event_offset.

OPTIMISTIC CONCURRENCY:
Concurrent deposits to same account:
Both read current state (balance: 10,000, version: 5)
Both publish events
Both events land in Kafka (ordered within partition by account_id)

Event handler processes event 1 → balance becomes 15,000, version 6
Event handler processes event 2 → balance becomes 20,000, version 7
Ordering guaranteed within partition → no concurrency issue if account_id used as partition key.

READ MODELS (CQRS + Event Sourcing):
• Account balance service: Kafka Streams KTable → Redis cache
• Transaction history: Kafka consumer → Elasticsearch
• Statement generation: Kafka consumer → PostgreSQL reporting DB
Each read model built independently from the same event stream.

BENEFITS FOR BANKING:
• Complete audit trail: events ARE the data — RBI compliance zero extra effort
• Temporal queries: replay up to any timestamp for historical balance
• Event replay: fix a bug → replay events → correct state
• Multiple projections: build any read model without schema migration` },

    { level:"Expert", q:"How do you design a CQRS and event sourcing system that handles bank account transfers with consistency guarantees?",
      a:`Fund transfer is the canonical distributed consistency challenge: atomically debit one account and credit another, possibly in different microservices.

SETUP:
• Account Service: owns accounts, exposes command handlers and events
• Transfer Orchestrator: coordinates the transfer Saga
• Event Store: Kafka (immutable, ordered per account)
• Read Models: account balance via Kafka Streams → Redis

TRANSFER FLOW WITH CQRS + EVENT SOURCING:

STEP 1 — INITIATE TRANSFER:
POST /transfers { from_account: A, to_account: B, amount: 10000, idempotency_key: uuid }
Transfer Orchestrator creates transfer:
  transfer_id = uuid (same as idempotency_key)
  Publish: TransferInitiated { transfer_id, from: A, to: B, amount: 10000 }

STEP 2 — DEBIT SOURCE:
Orchestrator sends command to Account Service: DebitAccount { account_id: A, amount: 10000, transfer_id }
Account Service:
  Load current state of account A from event store
  Validate: balance >= 10000?
  If YES: publish MoneyDebited { account_id: A, amount: 10000, transfer_id, new_balance: X }
  If NO: publish DebitFailed { account_id: A, reason: INSUFFICIENT_FUNDS, transfer_id }

STEP 3 — CREDIT DESTINATION (only if debit succeeded):
Orchestrator receives MoneyDebited event → sends: CreditAccount { account_id: B, amount: 10000, transfer_id }
Account Service:
  Publish MoneyCredited { account_id: B, amount: 10000, transfer_id, new_balance: Y }

STEP 4 — COMPLETE:
Orchestrator receives MoneyCredited → publishes TransferCompleted { transfer_id }
Client receives confirmation (either via polling or WebSocket).

FAILURE HANDLING — DEBIT SUCCESS, CREDIT FAILS:
Orchestrator receives CreditFailed → publishes ReverseDebit { account_id: A, amount: 10000, transfer_id }
Account Service: publish MoneyReversed { account_id: A, amount: 10000, transfer_id }
Orchestrator: publishes TransferFailed { transfer_id, reason: CREDIT_FAILED }

IDEMPOTENCY AT EVERY STEP:
Each command includes transfer_id.
Account service checks: has this transfer_id already been processed for this account?
If yes: return cached result (idempotent replay).
Store processed transfer IDs in account's event store or dedicated idempotency table.

CONSISTENCY MODEL:
Within an account: strong consistency (events ordered within Kafka partition by account_id).
Across accounts (A and B): eventual consistency — A is debited before B is credited.
During in-flight: A shows reduced balance, B hasn't been credited yet.
Resolution: always show transfer status — "in progress" until TransferCompleted event.
Final state: always consistent — either both accounts updated or neither (compensation reverses debit).

MONITORING:
Track: transfers in INITIATED state for > 60 seconds → alert (stuck transfer).
Dead letter: TransferFailed events → operations dashboard for manual review.
Metrics: transfer success rate, p99 completion time, compensation rate (should be < 0.01%).` },
  ]
};

const DOMAIN_OBS = {
  id: "obs", title: "Observability & SRE", icon: "📡", color: "#06b6d4",
  qa: [
    { level:"Basic", q:"What are the three pillars of observability?",
      a:`METRICS — Numerical measurements over time.
What: CPU%, request rate, error rate, p99 latency, queue depth.
Storage: time-series DB (Prometheus, InfluxDB).
Good for: dashboards, alerts, trend analysis, capacity planning.
Answers: WHAT is wrong? HOW MUCH is affected?
Limitation: doesn't tell you WHY.

LOGS — Timestamped records of events.
What: "Payment ID 12345 failed with error: insufficient funds at 14:32:15.234"
Storage: Elasticsearch, Loki, CloudWatch Logs.
Good for: debugging specific failures, audit trails, root cause investigation.
Limitation: high volume (banking at 10K TPS = millions of log lines/hour), expensive to store/query.

TRACES — End-to-end journey of a single request across services.
What: Payment request → API Gateway (8ms) → Auth Service (12ms) → Account Service (180ms, ← bottleneck) → Ledger (22ms) → Total: 222ms
Storage: Jaeger, Zipkin, AWS X-Ray, Honeycomb.
Good for: identifying which service is slow, debugging latency across microservices.
Limitation: sampling required at scale (can't store every trace).
Requires: trace ID injected at entry and passed through every service call.

HOW THEY WORK TOGETHER IN BANKING INCIDENT:
1. ALERT: Payment API error rate > 0.1% (Metric)
2. DASHBOARD: Which endpoint? /api/payments (Metric)
3. FIND TRACES: Sample failed payment trace IDs from Prometheus (Metric → Trace)
4. TRACE: Account Service taking 2,000ms instead of normal 50ms (Trace)
5. LOG: Account Service logs at that time: "DB connection pool exhausted - waiting for connection" (Log)
6. ROOT CAUSE: DB pool too small → increase pool size
Each pillar answers a different question. All three together give complete visibility.` },

    { level:"Basic", q:"What is an SLO and why does it matter for banking services?",
      a:`SLO (Service Level Objective) is an internal target for a measurable service quality metric (SLI).

SLI (Service Level Indicator): the actual measurement.
"Payment API success rate = successful requests / total requests × 100"
"p99 latency of /api/payments = 230ms"

SLO: your target for the SLI.
"Payment API success rate SLO: 99.95% per month"
"p99 latency SLO: < 500ms"

SLA (Service Level Agreement): contractual commitment to customers. SLA is looser than SLO.
SLO: 99.95% (internal target)
SLA: 99.9% (customer contract) — the buffer protects you from SLA breach.
99.9% = 8.7 hours downtime per year allowed.
99.95% = 4.4 hours per year allowed.

WHY SLOs MATTER IN BANKING:

ERROR BUDGETS:
SLO 99.95% means 0.05% error budget per month = 21.9 minutes of downtime/errors allowed.
If error budget is being consumed rapidly (major incident): freeze new feature deployments, focus on reliability.
If error budget is healthy: teams can take more risk with deployments.
This replaces "we should never have downtime" with "we can have up to X minutes, spend it wisely."

RBI COMPLIANCE:
RBI mandates minimum availability SLAs for core banking (typically 99.5% for net banking, higher for RTGS).
Your internal SLO should always be stricter than RBI mandate.
If RBI says 99.5%, your SLO should be 99.9% — so you catch degradation before breaching RBI requirements.

PRIORITISATION:
Without SLOs: all incidents feel equally urgent. With SLOs: incidents that threaten SLO breach get priority. Objective data replaces gut feel.

CUSTOMER TRUST:
Published SLAs + actual performance data = customer trust. Indian corporates negotiating banking services use SLA performance history in vendor evaluation.` },

    { level:"Basic", q:"What is distributed tracing and why do you need it in microservices banking?",
      a:`Distributed tracing tracks a single request as it travels through multiple microservices, recording timing and context at each step.

WITHOUT TRACING in banking:
Customer complaint: "My payment took 8 seconds." 
You have: API Gateway logs, Account Service logs, Fraud Service logs, Ledger logs — all in separate systems, different formats.
To diagnose: manually correlate logs by timestamp across 5 systems → hours of detective work.

WITH TRACING:
Every payment gets a trace ID at the API Gateway.
Trace ID passed through every service call as HTTP header: traceparent: 00-abc123-def456-01
Each service creates a "span" recording its processing time.
Jaeger UI shows: complete waterfall of the entire payment journey.

EXAMPLE TRACE for 8-second payment:
API Gateway: 5ms
Auth Service: 15ms
Fraud Service: 20ms
Account Service: 7,800ms ← BOTTLENECK
  └─ DB query: 7,750ms ← within Account Service
Ledger Service: 120ms
Notification: 40ms
Total: 8,000ms

Without tracing: Account Service is slow — but why? With tracing + DB query tracing: specific slow query identified immediately.

KEY CONCEPTS:
• Trace: complete journey of one request
• Span: single operation (one service's work), has start time + duration + parent span ID
• Span context: trace ID + span ID propagated in headers
• Baggage: key-value pairs propagated with trace (e.g., customer_tier for SLA differentiation)

BANKING-SPECIFIC SPANS TO ADD:
• Idempotency check result (hit/miss, duration)
• Fraud score + decision (without including card data)
• Ledger write confirmation
• External API calls (NPCI, bureau) with timing
• Maker-checker status check` },

    { level:"Intermediate", q:"What are the key metrics to monitor for a banking payment API?",
      a:`Organise metrics by the USE (Utilisation, Saturation, Errors) and RED (Rate, Errors, Duration) frameworks:

REQUEST METRICS (RED):
• Request Rate: requests/second to /api/payments. Baseline + alert on > 2x baseline (traffic spike or attack)
• Error Rate: (5xx responses / total) × 100. SLO: < 0.05%. Alert if > 0.1%.
• Duration: p50, p95, p99, p999 latency. p99 SLO: < 500ms. Alert if p99 > 1,000ms.
Monitor by endpoint, not just overall — /api/payments may be fine while /api/bulk-payments is degraded.

SATURATION METRICS (USE):
• CPU Utilisation: per pod and per node. Alert > 80% sustained.
• Memory Utilisation: per pod. Alert > 85%. Memory leak: slowly climbing memory over hours.
• JVM Heap: heap usage + GC pause time. Alert if GC pause > 200ms (causes request latency spikes).
• Thread Pool: active threads / total threads. Alert > 90% utilisation (approaching exhaustion).

DEPENDENCY METRICS:
• DB Connection Pool: active connections / pool size. Alert > 85%. Connection wait time p99.
• DB Query Latency: p99 per query type. Alert on queries > 100ms suddenly becoming 500ms.
• Kafka Consumer Lag: per consumer group. Alert if fraud_detection lag > 100 messages.
• External API (NPCI, Bureau): success rate + latency per external dependency. Circuit breaker state.
• Cache Hit Rate: Redis cache hit%. < 80% hit rate → investigate (cache invalidation issue? Cache too small?).

BUSINESS METRICS (most important for banking):
• Payment Success Rate: successful payments / attempted payments. Target > 99.99%. Alert if < 99.9%.
• Payment Processing Time: end-to-end customer experience (request received to confirmation sent). Not just API latency.
• Stuck Payments: payments in PENDING state > SLA threshold. Alert immediately.
• Idempotency: duplicate payment requests per minute (indicator of client-side issues or attack).
• Amount Processed: total ₹ processed per minute. Sudden drop = business impact alerting.

DASHBOARD LAYERS:
• Executive: payment success rate, amount processed (business pulse)
• Operations: error rate, latency, queue depth (health)
• Engineering: CPU, memory, DB pool, JVM metrics (technical health)
• SRE: SLO burn rate, error budget remaining` },

    { level:"Intermediate", q:"What is a postmortem and how do you conduct a blameless one?",
      a:`A postmortem is a structured review of a production incident — what happened, why, and how to prevent recurrence. "Blameless" means the goal is learning and system improvement, not assigning personal fault.

WHY BLAMELESS:
If postmortems blame people: engineers hide incidents, fix problems silently (no learning), fear of punishment prevents honest reporting of near-misses. The system doesn't improve.
If postmortems are blameless: engineers report incidents openly, near-misses are shared, root cause analysis goes deep, systematic problems get fixed.

POSTMORTEM STRUCTURE:

1. INCIDENT SUMMARY:
Date, duration, impact, services affected, customer impact.
"Payment service was degraded from 14:32 to 15:47 (75 minutes). 12,847 payment attempts failed. ₹47 crore in transactions were delayed."

2. TIMELINE:
Chronological record with exact timestamps:
14:32 — First alert fires: payment error rate > 1%
14:35 — On-call engineer acknowledges
14:42 — DB connection pool exhaustion identified
14:55 — Decision to restart service (wrong approach, didn't fix root cause)
15:10 — DB identified as bottleneck
15:25 — Connection pool size increased
15:47 — Error rate returns to normal

3. ROOT CAUSE ANALYSIS (Five Whys):
Why were payments failing? → DB connection pool exhausted
Why was pool exhausted? → More connections than pool size
Why more connections needed? → Monthly statement generation job running simultaneously with peak payment traffic
Why did we not know this? → Statement job was scheduled without load analysis
Why was there no load analysis? → No process requiring capacity check before scheduling batch jobs

4. CONTRIBUTING FACTORS (not "who caused"):
• No scheduling governance for batch jobs
• No monitoring of connection pool utilisation (alert would have caught it 30 min earlier)
• Monthly statement job was undocumented (runbook missing)

5. ACTION ITEMS (with owners and due dates):
• Add connection pool monitoring with alert at 85% → Team A → 1 week
• Document all batch jobs and their resource requirements → Team B → 2 weeks
• Create batch job scheduling review process → Platform Team → 3 weeks
• Add load test covering batch + peak traffic scenario → QA Team → 4 weeks

6. WHAT WENT WELL:
• Monitoring caught the issue within 5 minutes of onset
• Team assembled quickly
• Clear communication to stakeholders throughout
(Recognising what worked reinforces good practices)

WHEN TO DO:
• Any customer-impacting incident (mandatory)
• Near-misses that could have been impactful (encouraged)
• Within 48-72 hours while memory is fresh
• Never delay to "wait for full information" — do timeline postmortem, update later` },

    { level:"Advanced", q:"Design a monitoring and alerting strategy for a core banking platform.",
      a:`Core banking monitoring must detect issues before customers do, with false-positive rates low enough that on-call engineers trust alerts.

MONITORING ARCHITECTURE:

METRICS COLLECTION:
• Prometheus scrapes metrics from all services (JVM metrics via Micrometer, custom business metrics)
• Push gateway for batch jobs (short-lived, can't be scraped)
• Node exporter: OS-level metrics (disk, network, CPU)
• Cloud metrics: AWS CloudWatch for RDS, EKS, ELB — federated to Prometheus

ALERTING LAYERS:

LAYER 1 — INFRASTRUCTURE (Operations team):
• Disk > 80% → warning. > 90% → critical.
• CPU > 85% sustained 5 min → warning.
• Node unreachable → critical.
• Pod restart count > 3/hour → warning.

LAYER 2 — APPLICATION (SRE team):
• Payment API error rate > 0.1% → warning. > 0.5% → critical PagerDuty.
• p99 latency > 1,000ms sustained 2 min → warning.
• DB connection pool > 85% → warning.
• Kafka consumer lag > threshold per group → per-group thresholds.

LAYER 3 — BUSINESS (Business operations team):
• Payment success rate < 99.9% → critical (business impact).
• No payments processed in 60 seconds (zero-throughput) → critical.
• Unusual transaction amounts (> 5x average for that time of day) → review.
• Reconciliation match rate < 99.9% → warning.

ALERT QUALITY:
Every alert must be:
• ACTIONABLE: engineer knows what to do when they receive it
• URGENT: if it's not worth waking someone for, it shouldn't page
• ACCURATE: frequent false positives → engineers ignore alerts → delayed response to real incidents

RUNBOOK per alert:
• What is this alert?
• What does it typically mean?
• Immediate steps to diagnose
• Common fixes
• Escalation path

SLO BURN RATE ALERTS (most sophisticated):
Instead of: "error rate > 0.1%" (noisy — one bad minute pages)
Use: "SLO burn rate" — at current error rate, how fast are we consuming the monthly error budget?
• 14.4x burn rate for 1 hour → page (consuming 14.4x faster than sustainable, 1-hour burn will exhaust daily budget)
• 1x burn rate for 6 hours → warning (on track to consume full budget at this rate)
This gives: early warning for sustained low-level issues while avoiding false positives from brief spikes.

DASHBOARDS:
• Customer experience dashboard: payment success rate, end-to-end latency (what customers feel)
• Dependency health: status of each external dependency (NPCI, SMS provider, credit bureau)
• Capacity: resource utilisation trends with projected exhaustion date
• SLO burn: real-time error budget consumption` },

    { level:"Advanced", q:"How do you implement distributed tracing in a banking microservices environment?",
      a:`Implementing distributed tracing across 20+ banking microservices requires standardisation, automation, and thoughtful sampling.

STANDARD: OpenTelemetry (vendor-neutral, CNCF project)
• Standardises: APIs, SDKs, data formats, exporters
• Supported by: Jaeger, Honeycomb, Datadog, AWS X-Ray — avoid vendor lock-in

INSTRUMENTATION:

AUTO-INSTRUMENTATION (zero code change):
• Java agent: -javaagent:opentelemetry-javaagent.jar
• Automatically instruments: Spring HTTP (inbound + outbound), JDBC queries, Kafka produce/consume, Redis calls
• Each operation gets a span with timing and metadata
• 80% of tracing value from zero code changes

MANUAL INSTRUMENTATION (for banking-critical operations):
@WithSpan("fraud.check")
public FraudResult checkFraud(Payment payment) {
    Span span = Span.current();
    span.setAttribute("payment.amount", payment.getAmount());
    span.setAttribute("fraud.model.version", modelVersion);
    // ...
    span.setAttribute("fraud.score", score);
    span.setAttribute("fraud.decision", decision);
    return result;
}

CONTEXT PROPAGATION:
API Gateway generates trace ID on every inbound request.
HTTP header: traceparent: 00-{traceId}-{spanId}-01
Spring Web: auto-extracted from incoming request, auto-injected into outgoing calls.
Kafka: inject into message headers on produce, extract on consume.
Database: spans automatically created for each query by JDBC auto-instrumentation.

COLLECTION PIPELINE:
Service → OTLP → OpenTelemetry Collector (batching, filtering) → Jaeger backend
Collector handles: tail-based sampling, enrichment (add environment, service version), batching (reduce connections).

SAMPLING STRATEGY:
100% sampling = 10K TPS × average 8 spans per trace = 80K spans/second → too expensive.

HEAD-BASED SAMPLING (simple):
Sample 1% of traces randomly. Cheap. Problem: misses rare errors (if error rate is 0.01%, 99% of error traces are dropped).

TAIL-BASED SAMPLING (recommended for banking):
Collector receives ALL spans, waits for full trace to arrive (tail buffer), then decides:
• KEEP: if trace has any error span → keep 100%
• KEEP: if trace duration > 1,000ms → keep 100% (slow traces)
• KEEP: if trace involves fraud flag → keep 100%
• SAMPLE: normal traces → keep 5%
Result: all interesting traces preserved, normal traces sampled.

JAEGER:
• Open source, CNCF project
• Cassandra backend for high-volume trace storage
• Retention: 7 days detailed, sampled traces 30 days
• UI: trace search by service, duration, error status, tag` },

    { level:"Expert", q:"How do you build a real-time operations dashboard for a banking platform?",
      a:`A real-time ops dashboard gives instant visibility into payment processing health, system status, and business metrics — the single screen an on-call engineer checks first.

ARCHITECTURE:

DATA SOURCES:
• Prometheus: metrics (latency, error rates, throughput, system resources)
• Kafka: business event stream (payment.completed, payment.failed)
• Application logs: error patterns, structured log fields
• External monitors: ping checks to NPCI, SMS provider, credit bureau APIs

AGGREGATION LAYER:
• Kafka Streams: real-time business metric calculation (payments/min, success rate last 5 min)
• Prometheus recording rules: pre-compute expensive queries (payment_success_rate:5m)
• Time-series aggregation: counters, gauges, histograms per service per time window

DASHBOARD DESIGN PRINCIPLES:

HIERARCHY (top to bottom):
1. Overall health indicator: GREEN / YELLOW / RED (immediate status at a glance)
2. Customer-facing metrics (what matters most):
   • Payment success rate (last 5 min, 1 hr, 24 hr)
   • p99 latency
   • Payments processed / minute + ₹ volume
3. System health:
   • Service dependency status matrix (each service: green/red)
   • Kafka consumer lag per group
   • DB pool utilisation
4. Active incidents and alerts

REAL-TIME FEED:
• Live payment transactions ticker (anonymised: ₹XXXXX | Account XXXX1234 | SUCCESS)
• Gives feel for system activity, anomalies visible before metrics catch them

TOOLING:
• Grafana: industry standard, integrates with Prometheus natively
• Custom React dashboard: more flexibility for business metrics and branded experience
• Mobile-responsive: on-call engineers monitor from phone at 3 AM

SPECIFIC PANELS:

Payment Success Rate (time series + threshold line):
Current: 99.97% | SLO: 99.95% | Status: HEALTHY

Latency Heatmap:
Y-axis: latency buckets (0-100ms, 100-500ms, 500ms-1s, >1s)
X-axis: time
Colour intensity: request volume
Shows distribution, not just averages.

Service Dependency Matrix:
         | API GW | Account | Fraud | Ledger | NPCI  | SMS
Status   |   ✓    |    ✓   |   ✓  |   ✓   |  ✓   |  ⚠️

Kafka Lag Monitor:
Consumer Group          | Topic              | Total Lag | Status
fraud_detection         | payment.events     | 47        | ✓
notification_service    | payment.events     | 1,203     | ⚠️ (SLOW)
audit_logger            | all.events         | 23,100    | ✗ (ALERT)

ALERTING INTEGRATION:
Every alert shown on dashboard: what fired, when, current status.
One-click to Runbook.
One-click to relevant Jaeger trace search.
On-call engineer: open dashboard → see the problem → click runbook → diagnose → fix.
Mean Time to Detect (MTTD) target: < 2 minutes.
Mean Time to Diagnose (MTTDi) target: < 10 minutes.` },
  ]
};

const DOMAIN_PERF = {
  id: "perf", title: "Performance & Caching", icon: "⚡", color: "#f59e0b",
  qa: [
    { level:"Basic", q:"What is caching and why is it used in banking systems?",
      a:`Caching stores the result of an expensive computation or query in fast storage (memory) so subsequent requests get the result instantly without repeating the work.

WITHOUT CACHE:
Every balance inquiry → query the database → 5-10ms per query.
At 1,000 balance queries/second → 1,000 DB queries/second → DB under constant load.
At 10,000 queries/second → DB overwhelmed, latency degrades, payments affected.

WITH CACHE (Redis):
First request → DB query (5ms) → store in Redis → return.
Next 1,000 requests → Redis hit (<1ms) → return (no DB query).
DB load reduced by 99%.

BANKING USE CASES:

Account balances (read-heavy):
• Balance queried every login, every payment check, every statement view
• Stale by 5-30 seconds is acceptable for display
• Cache in Redis, TTL 30 seconds, invalidate on transaction commit

Session data:
• User is authenticated → store session in Redis
• Every API request checks Redis for session (not DB)
• Sub-millisecond session validation

Reference data (rarely changes):
• IFSC codes, bank names, product configurations, exchange rates
• TTL: 1-24 hours (or invalidate on update)
• Cache in Redis or in-process cache (Caffeine)

Idempotency keys:
• Check if payment UUID has been processed before
• Redis SETNX (atomic set-if-not-exists) — perfect cache operation
• TTL: 24-48 hours

WHAT NOT TO CACHE:
• Real-time fraud signals (must be fresh)
• Post-transaction balances for critical operations (use DB with SELECT FOR UPDATE)
• Regulatory data being reported (must be from authoritative source)` },

    { level:"Basic", q:"What is Redis and how is it used in banking?",
      a:`Redis (Remote Dictionary Server) is an in-memory data structure store. It operates on data in RAM — nanosecond to microsecond operations vs milliseconds for disk-based databases.

DATA STRUCTURES:
• String: simple key-value. Use: balance cache, idempotency keys, session tokens.
• Hash: field-value pairs per key. Use: account summary (balance, name, status in one key).
• List: ordered list. Use: recent transaction history (LPUSH on new transaction, LRANGE for last N).
• Set: unordered unique values. Use: beneficiary whitelist per customer.
• Sorted Set: values with scores, sorted by score. Use: leaderboard of transaction amounts, rate limiting (score = timestamp).
• Stream: append-only log. Use: audit event stream, real-time activity feed.

BANKING USE CASES:

Session Management:
SET session:token_abc123 '{"user_id":"KP","roles":["TELLER"]}' EX 1800
GETEX session:token_abc123 EX 1800  (auto-extend TTL on activity)

Rate Limiting (sliding window):
ZADD rate:user123 timestamp timestamp  (add current timestamp to sorted set)
ZREMRANGEBYSCORE rate:user123 0 (now - 60s)  (remove old entries)
ZCARD rate:user123  (count = requests in last 60 seconds)
If count > limit → reject.

Idempotency:
SET idempotency:pay-uuid-123 '{"status":"processing"}' EX 86400 NX
(NX = only set if not exists — atomic check-and-set)

Distributed Lock (Redlock):
SET lock:account:12345 uuid PX 5000 NX
(Acquire lock for 5 seconds, only if not held)
If acquired: process → DEL lock:account:12345
If not acquired: wait and retry.

PERSISTENCE (important for banking):
Redis is in-memory — restart = data loss (unless persistence configured).
• RDB: periodic snapshot to disk (some loss possible — last snapshot)
• AOF (Append Only File): log every write → replay on restart (near-zero loss)
• Banking: enable AOF with fsync every second — acceptable durability for cache data
• Session data: can use AOF. Idempotency keys: can tolerate some loss (worst case: duplicate processing caught by idempotent handler).` },

    { level:"Intermediate", q:"Explain caching strategies in banking: Cache-Aside, Write-Through, Write-Behind.",
      a:`CACHE-ASIDE (Lazy Loading) — application manages cache explicitly:
Read: check cache → HIT: return. MISS: fetch from DB → store in cache → return.
Write: update DB → invalidate (delete) the cache key.
(Don't update cache on write — let next read repopulate with fresh DB data.)

Pros: cache only stores what's actually requested; app works if cache goes down (falls back to DB).
Cons: first request always hits DB (cold start); brief window between DB write and cache invalidation where stale data is served.

Banking use: account balance reads, beneficiary lists, product configurations.

WRITE-THROUGH — every write goes to cache AND DB synchronously:
Write: write to cache → write to DB → return.
Cache always consistent with DB.
Pros: strong consistency between cache and DB.
Cons: write latency doubles (two writes); cache stores all written data (some may never be read).
Banking use: configuration data, exchange rates — infrequent writes but strong consistency needed.

WRITE-BEHIND (Write-Back) — write to cache only, DB updated asynchronously:
Write: write to cache → return immediately (DB written later by background process).
Pros: very fast writes — response before DB write completes.
Cons: data loss if cache fails before DB flush; complex failure handling.
Banking: NEVER use for financial data (balance, transactions, ledger). Acceptable only for: user preferences, non-critical counters.

READ-THROUGH — cache manages its own population:
Application queries cache only. Cache misses trigger cache-to-DB fetch transparently.
Simpler application code.
Implementation: Redis with cache-through plugin or application-level cache wrapper.
Banking use: good for reference data APIs where staleness is acceptable.

SUMMARY for banking:
Write path for financial data: write to DB always, invalidate cache.
Read path for financial data: Cache-Aside with short TTL.
Never Write-Behind for financial data — durability is non-negotiable.` },

    { level:"Intermediate", q:"What is cache invalidation? How do you handle it in a banking system?",
      a:`Cache invalidation — deciding WHEN to remove cached data so stale data is never served longer than acceptable.

THREE STRATEGIES:

TTL (Time-To-Live) — data expires automatically after N seconds:
SET balance:account123 45000 EX 30  (expires in 30 seconds)
Simple. No explicit invalidation needed.
Risk: if balance changes at second 1 and TTL is 30 seconds, stale data served for 29 more seconds.
Acceptable for: display balance (customer sees "balance 5 seconds ago"). NOT acceptable for: debit validation.

EVENT-BASED INVALIDATION — delete cache when data changes:
After every successful transaction:
DEL balance:account123  (delete cache)
Next read: cache miss → fresh DB read → re-cache.
Pro: always fresh after any change.
Con: requires explicit invalidation in every code path that changes data. Easy to miss one path → stale cache permanently.

HYBRID (recommended for banking):
Use TTL as safety net (30-60 seconds) + explicit invalidation on write.
Best case: invalidation fires immediately after write → next read is fresh.
Worst case (missed invalidation): TTL expires → stale data for max 30-60 seconds → acceptable.

CACHE INVALIDATION PATTERNS:

CACHE INVALIDATION VIA EVENTS:
Payment committed → publish PaymentCompleted event to Kafka.
Cache invalidation service consumes event → DEL balance:{account_id} for all affected accounts.
Decoupled from business logic — no risk of forgetting invalidation in service code.
Consistency: all API gateway instances invalidate their local caches too (Redis pub/sub broadcast).

MULTI-LEVEL CACHE:
L1: In-process cache (Caffeine) — per pod, 5-second TTL (ultra-fast, tiny)
L2: Redis cluster — shared, 30-second TTL
After write: invalidate Redis → next request gets L2 miss → L1 miss → DB → repopulates both levels.

BANKING-SPECIFIC:
Never cache the debit validation check with long TTL.
After a withdrawal: invalidate balance cache immediately.
Between invalidation and next read: show last known balance + "balance may be updating" indicator.
Always return the new balance directly in the payment API response — don't force client to re-query.` },

    { level:"Advanced", q:"How do you approach performance testing for a banking payment system?",
      a:`Performance testing validates that the system meets its SLOs under expected and peak load before production. In banking, finding performance issues in production is catastrophic.

TYPES OF PERFORMANCE TESTS:

LOAD TEST: simulate expected production load. Does the system meet SLOs at normal traffic?
Target: 5,000 TPS for 30 minutes sustained.
Assert: p99 latency < 500ms, error rate < 0.01%, no memory leak (heap stable).

STRESS TEST: increase load until system breaks. Find the breaking point and failure mode.
Start at 5,000 TPS, increase by 1,000 TPS every 5 minutes.
Observe: at what TPS does p99 exceed 1,000ms? At what TPS do errors appear? What breaks first (CPU, DB connections, Kafka)?
Result: know your headroom. If peak is 8,000 TPS and prod load is 5,000, you have 60% headroom.

SPIKE TEST: sudden burst of traffic. Banking has clear peaks (9 AM market open, 5 PM salary day).
Ramp from 1,000 to 10,000 TPS in 30 seconds. Observe: auto-scaling fast enough? Circuit breakers trip correctly?

ENDURANCE (SOAK) TEST: sustained load for hours. Finds memory leaks, connection leaks, thread leaks.
5,000 TPS for 6 hours. Observe: heap usage trend (should be stable, not climbing), connection pool behaviour.

TOOL: Gatling (recommended for banking):
• Scala DSL for readable test scenarios
• Real-time metrics during test (Graphite/InfluxDB integration)
• HTML report with percentile charts
• Handles stateful scenarios (login → check balance → payment)

SCENARIO DESIGN:
Realistic mix (based on production traffic analysis):
60% balance inquiries
25% payment initiation
10% transaction history queries
5% account management

Each scenario uses realistic data:
• Pre-generated account IDs, amounts, beneficiaries
• Not synthetic data — payment amounts drawn from historical distribution
• Idempotency keys: unique per run, per request

BASELINE → CHANGE → COMPARE:
Before any performance-impacting change:
Record baseline: p50, p95, p99, p999, throughput, error rate.
Make change.
Re-run identical test.
Compare: regression? > 10% latency increase → fail the test, block deployment.
Automated in CI/CD: performance test runs on every release candidate. Regression blocks promotion to production.

PRODUCTION PROFILING (for existing issues):
• Async-profiler: attach to running JVM, CPU flame graph without restart
• Arthas (Alibaba): trace method execution in production JVM safely
• PostgreSQL: pg_stat_statements — top 10 slowest queries, exact counts and avg duration
• JVM GC log analysis: identify GC pause duration and frequency (GC overhead > 5% → investigate heap)` },

    { level:"Advanced", q:"How do you diagnose and fix N+1 query problems in a banking application?",
      a:`N+1 query problem: loading 1 parent record then making N separate queries for N children. Extremely common in ORM-heavy banking applications.

EXAMPLE IN BANKING:
// WRONG: N+1 query
List<Account> accounts = accountRepo.findByBranchId(branchId);  // 1 query
for (Account account : accounts) {
    List<Transaction> txns = transactionRepo.findByAccountId(account.getId());  // N queries
    // process transactions
}

If branch has 500 accounts: 1 + 500 = 501 queries. At 10 branches: 5,010 queries. DB overwhelmed.

DETECTION:
• Hibernate statistics: hibernate.generate_statistics=true → logs all queries with count
• Spring Boot Actuator: /actuator/metrics/hibernate.queries
• P6Spy or Datasource Proxy: logs every SQL with count per request → "501 queries in 2.3 seconds for this endpoint"
• APM tool (Datadog, Dynatrace): automatically highlights N+1 patterns

FIXES:

FIX 1 — JOIN FETCH (JPA):
@Query("SELECT a FROM Account a JOIN FETCH a.transactions WHERE a.branchId = :branchId")
List<Account> findByBranchIdWithTransactions(@Param("branchId") Long branchId);
One query with JOIN. Returns accounts with transactions already loaded.

FIX 2 — BATCH LOADING:
@BatchSize(size = 100)
@OneToMany(mappedBy = "account")
private List<Transaction> transactions;
Hibernate loads transactions in batches: 1 account query + ceil(N/100) transaction queries. 500 accounts = 1 + 5 = 6 queries.

FIX 3 — NATIVE SQL with DTO projection:
@Query(value = """
  SELECT a.id, a.account_number, a.balance,
         t.id as txn_id, t.amount, t.created_at
  FROM accounts a
  LEFT JOIN transactions t ON t.account_id = a.id AND t.created_at > :since
  WHERE a.branch_id = :branchId
""", nativeQuery = true)
List<AccountWithTransactionDTO> findBranchData(Long branchId, LocalDateTime since);
Single optimised SQL, DTO projection (only fetch needed fields).

FIX 4 — SEPARATE QUERIES + APPLICATION JOIN (for very large result sets):
List<Long> accountIds = accountRepo.findIdsByBranchId(branchId);  // 1 query, IDs only
List<Transaction> allTxns = transactionRepo.findByAccountIdIn(accountIds);  // 1 query, IN clause
// Join in application code using Map<accountId, List<Transaction>>
2 queries total regardless of count.

BANKING IMPACT:
Branch dashboard loading 500 accounts × their recent transactions: 501 queries → 8-second response.
After FIX 3: 1 query → 200ms response.
This type of fix is the highest-ROI performance improvement in most banking applications.` },

    { level:"Expert", q:"Design a caching architecture for a banking platform handling 100,000 balance reads per second.",
      a:`100,000 balance reads/second requires multi-layer caching — no single component can handle this alone.

CALCULATION:
100K reads/second × 10ms avg DB query = 1,000,000ms = 1,000 seconds of DB time per second.
You need 1,000 DB connections just for reads. Not feasible.
Target: serve 99%+ of reads from cache. DB handles only 1,000 reads/second (1% of total).

LAYER 1 — IN-PROCESS CACHE (Caffeine, per pod):
• Ultra-fast: in-heap, nanoseconds
• TTL: 5 seconds (very short — stale data risk, but only 5 seconds)
• Max size: 50,000 entries per pod (10 pods = 500,000 accounts cached)
• Hit rate: ~70% of reads served here (frequently accessed accounts)
• Eviction: LRU (Least Recently Used)
• Cost: JVM heap memory (no network hop)

Configuration:
Cache<Long, AccountBalance> localCache = Caffeine.newBuilder()
    .maximumSize(50_000)
    .expireAfterWrite(5, TimeUnit.SECONDS)
    .recordStats()
    .build();

LAYER 2 — REDIS CLUSTER:
• Shared across all pods: consistent data regardless of which pod serves request
• TTL: 30 seconds
• Hit rate target: 28% of remaining reads (after L1 miss)
• Redis Cluster: 6 nodes (3 primary + 3 replica), ~100K ops/second per node → handles 300K ops/second
• Data size: 50 bytes per balance entry × 10 million accounts = 500MB (fits in Redis cluster easily)

LAYER 3 — DATABASE (read replicas):
• Remaining 2% of reads (100K × 2% = 2,000 reads/second)
• 3 read replicas (each handling ~700 reads/second — well within capacity)
• Primary DB: only writes (transaction processing) — zero balance read load

CACHE WARMING:
On startup: pre-populate Redis with top N most-active accounts (from previous day's query patterns).
Prevents cold start thunder: all 10 pods starting simultaneously, all hitting DB for same hot accounts.

INVALIDATION:
Transaction commits → publish AccountBalanceChanged event to Kafka.
Cache invalidation service consumes → DEL from Redis immediately → L1 TTL handles pod-level caches.
Between invalidation and TTL expiry on L1: at most 5 seconds stale balance on display.
Critical operations (payment processing): skip cache entirely, always read from DB primary with SELECT FOR UPDATE.

CACHE STAMPEDE PREVENTION:
When Redis entry expires and 1,000 pods simultaneously get L2 miss → 1,000 DB queries for same account (cache stampede).
Solution: probabilistic early expiry. When TTL < 20% of original, randomly decide to refresh early.
Or: distributed lock — only one pod fetches from DB and repopulates, others wait briefly for repopulated entry.

MONITORING:
• L1 hit rate per pod (Caffeine stats → Micrometer → Prometheus)
• L2 hit rate (Redis INFO stats → Prometheus)
• Cache miss rate trending up → hot new accounts, increase cache size
• P99 cache read latency: L1 < 0.1ms, L2 < 1ms
• Alert: L2 hit rate < 90% → investigate (cache too small? invalidation bug? traffic pattern change?)` },

    { level:"Expert", q:"How do you handle memory management and GC tuning for a high-throughput banking JVM application?",
      a:`JVM memory management directly affects banking application latency. GC pauses > 100ms cause payment processing spikes visible to customers.

JVM MEMORY LAYOUT:
• Heap: Young Generation (Eden + Survivor) + Old Generation
• Non-heap: Metaspace (class metadata), Code Cache (JIT compiled code), Direct Memory (NIO buffers)

GC ALGORITHM SELECTION:

G1GC (Java 9+ default):
Good balance of throughput and pause time.
Target pause: -XX:MaxGCPauseMillis=100
Banking sweet spot: 4-16GB heap, moderate allocation rate.
Use for: most banking microservices.

ZGC (Java 15+, low-latency):
Sub-millisecond pauses regardless of heap size.
Good: payment processing services where any GC pause is unacceptable.
Cost: slightly higher CPU overhead (10-15% more CPU than G1).
Use for: payment APIs where p999 latency SLO is strict (< 100ms p999).

Shenandoah (Red Hat):
Similar to ZGC — concurrent, low pause.
Use for: same use cases as ZGC on OpenJDK.

HEAP SIZING:
• Initial = max heap: -Xms4g -Xmx4g (prevents heap resize pauses)
• Young generation: 25-33% of total heap (G1 manages this automatically)
• Too small heap: frequent GC (CPU wasted on GC). Too large: longer GC pauses when old gen GC runs.
• Target: GC overhead < 5% of CPU. Monitor: jvm_gc_collection_seconds_sum / wall_clock_time

COMMON BANKING JVM ISSUES:

MEMORY LEAK:
Symptom: heap usage slowly climbs over hours. GC runs but heap doesn't shrink back to baseline.
Diagnosis: heap dump → Eclipse MAT → find object with unexpectedly large retained heap.
Common causes: HashMap grows unboundedly (cache without eviction), ThreadLocal not cleaned, Hibernate session not closed.
Fix: heap profiling in load test environment (not production if possible).

EXCESSIVE GC PRESSURE:
Symptom: GC overhead > 10%, frequent minor GCs.
Cause: high allocation rate (creating many short-lived objects).
Diagnosis: async-profiler with alloc mode → flame graph shows which code allocates most.
Fix: reduce allocations (reuse objects, use primitive arrays instead of boxed types, avoid creating String in hot paths).

LONG GC PAUSES:
Symptom: p99 latency spikes every few minutes (correlates with GC).
Cause: Old Gen full → Full GC (stop-the-world).
Fix: increase heap, switch to ZGC/Shenandoah, reduce object promotion to old gen (tune survivor ratio).

DIRECT MEMORY:
Kafka, Netty use direct memory (off-heap). 
-XX:MaxDirectMemorySize=2g — set explicitly.
Symptom: OutOfMemoryError: Direct buffer memory despite heap having free space.
Fix: increase MaxDirectMemorySize or find BufferPool leak.

GC LOGGING (always enable in production):
-Xlog:gc*:file=/logs/gc.log:time,uptime,level,tags:filecount=5,filesize=20m
Parse with: GCViewer, GCEasy — identify problematic GC events
Alert: pause > 500ms → investigate immediately.` },
  ]
};

const DOMAIN_DEVOPS = {
  id: "devops", title: "DevOps & CI/CD", icon: "🚀", color: "#8b5cf6",
  qa: [
    { level:"Basic", q:"What is CI/CD? Why is it critical for banking software delivery?",
      a:`CI (Continuous Integration): developers merge code frequently (daily or more), each merge triggers automated build and tests. Detects integration issues early.

CD (Continuous Delivery/Deployment): every successful CI build produces a deployable artifact. Deployment to production can happen with one click (delivery) or automatically (deployment).

WHY CRITICAL IN BANKING:

QUALITY:
• Manual testing is slow and error-prone. Automated tests run in minutes.
• Every commit tested: unit, integration, security, compliance.
• Bugs caught before production, not by customers.

SPEED:
• Manual deployment: hours of coordination, manual steps, rollback plan on paper.
• CI/CD: deployment in 15 minutes, automated rollback on failure.
• More frequent releases = smaller changes = less risk per release.

COMPLIANCE:
• RBI requires audit trail of changes. CI/CD provides: who committed, what tests ran, who approved, when deployed — automatically logged.
• Change Advisory Board (CAB) approval integrated into pipeline.
• No manual deployments → no undocumented changes.

CONSISTENCY:
• "Works on my machine" problem eliminated. Every environment built from same artifact.
• Dev, staging, production: identical builds.

BANKING CI/CD PIPELINE (overview):
Code commit → Build + Unit Tests → SAST (static security analysis) → Container build → Image scan → Deploy to staging → Integration tests → Performance test → Approval gate → Deploy to production (blue-green) → Smoke tests → Monitor.

Total time target: < 45 minutes from commit to production-ready artifact.` },

    { level:"Basic", q:"What is Docker and Kubernetes? Why are they used in banking?",
      a:`DOCKER: Platform for containerising applications. A container packages the application + all its dependencies (Java runtime, libraries, config) into a portable, isolated unit.

Why Docker in banking:
• Environment consistency: "works in staging" = "works in production" — same container image.
• Isolation: payment service and fraud service can't interfere with each other's dependencies.
• Fast startup: containers start in seconds vs VMs in minutes.
• Efficiency: run 20 containers on one server vs 5 VMs.

KUBERNETES (K8s): Container orchestration platform — manages where containers run, how many instances, how they communicate, how they recover from failures.

Core concepts:
• Pod: smallest unit — one or more containers sharing network/storage.
• Deployment: defines desired state (3 replicas of payment-service). K8s maintains it.
• Service: stable DNS name for a group of pods (payment-service.default.svc.cluster.local).
• Ingress: routes external HTTP traffic to services.
• HPA (Horizontal Pod Autoscaler): auto-scales pods based on CPU/memory/custom metrics.

WHY KUBERNETES IN BANKING:
• Auto-healing: pod crashes → K8s restarts it automatically (within 30 seconds).
• Zero-downtime deployment: rolling updates — new pods come up before old pods go down.
• Auto-scaling: 9 AM peak load → HPA adds pods automatically; 2 AM low load → pods removed (cost saving).
• Resource limits: payment service can't consume all cluster CPU and starve fraud service — enforced by K8s resource limits.
• Multi-AZ deployment: pods spread across availability zones automatically → no single data centre failure takes down the service.

Kubernetes in Indian banking: HDFC, Axis, and most modern fintech (Razorpay, PhonePe) run on Kubernetes on AWS/GCP.` },

    { level:"Basic", q:"What is infrastructure as code (IaC)? How does it benefit banking?",
      a:`Infrastructure as Code (IaC) means defining and provisioning infrastructure (servers, networks, databases) using code/configuration files rather than manual UI clicks.

TOOLS:
• Terraform: cloud-agnostic, widely used. Defines AWS/GCP/Azure resources in HCL (HashiCorp Configuration Language).
• AWS CloudFormation: AWS-specific, YAML/JSON templates.
• Pulumi: IaC using real programming languages (TypeScript, Python).
• Ansible: configuration management — what software should be installed on servers.

EXAMPLE (Terraform for a banking DB):
resource "aws_db_instance" "banking_db" {
  identifier        = "banking-prod-postgres"
  engine           = "postgres"
  engine_version   = "15.4"
  instance_class   = "db.r6g.xlarge"
  allocated_storage = 500
  multi_az         = true
  encrypted        = true
  kms_key_id       = aws_kms_key.db_key.arn
  backup_retention_period = 30
  deletion_protection = true
}

WHY IaC IN BANKING:

AUDITABILITY:
Every infrastructure change is a code commit with: who changed what, when, why (commit message), reviewed by whom (PR approval). RBI can audit infrastructure changes.

CONSISTENCY:
Dev environment = staging environment = production (same Terraform code, different variable values). No "snowflake servers" with manual tweaks that nobody remembers.

DISASTER RECOVERY:
If entire region goes down, spin up identical infrastructure in another region in 30 minutes by running Terraform apply — not days of manual configuration.

COMPLIANCE:
IaC enforces standards: every database MUST have encryption=true, backup_retention=30. If someone tries to deploy without, Terraform plan shows violation. Can be caught in CI/CD before deployment.

CHANGE MANAGEMENT:
Terraform plan shows exact changes before applying: "will add 2 subnets, modify security group, NO destructive changes." Ops team reviews plan before apply — like code review for infrastructure.` },

    { level:"Intermediate", q:"What is a blue-green deployment? How is it used for zero-downtime banking releases?",
      a:`Blue-green deployment runs two identical production environments. One (Blue) serves all traffic. When ready to deploy, update the idle environment (Green), test, then switch traffic. Instant, zero-downtime.

SETUP:
Blue: current production (v1.0) serving 100% traffic.
Green: idle environment (v1.1 deployed and tested).
Load balancer: controls which is "live."

DEPLOYMENT STEPS:
1. Deploy v1.1 to Green (Blue serves 100% traffic — no customer impact).
2. Run smoke tests on Green: critical payment flows, balance checks, auth.
3. Run parallel load test: send copy of production traffic to Green (shadow testing).
4. Switch load balancer: Green now serves 100% traffic (< 1 second).
5. Blue stays running: instant rollback possible for 1-24 hours.
6. After confidence period: decommission Blue.

ROLLBACK:
Any problem detected → switch load balancer back to Blue.
Time: < 30 seconds.
Old version immediately live — no redeploy needed.

BANKING-SPECIFIC CONSIDERATIONS:

DATABASE SCHEMA:
Both Blue (v1.0) and Green (v1.1) share the same database.
DB migrations must be backward-compatible: Green's schema changes must still work with Blue's code (in case you need to roll back).
Use expand-contract migration pattern.

SESSIONS:
Users may have sessions mid-transaction when traffic switches to Green.
Solution: externalise sessions to Redis (shared between Blue and Green). Sessions survive the switch.

LONG-RUNNING TRANSACTIONS:
Connection drain: load balancer stops sending NEW requests to Blue but existing connections complete naturally (typically 30-60 second drain period).
Long-running jobs (report generation): complete on Blue before decommissioning.

COST:
Blue-green requires 2x infrastructure cost during deployment.
Acceptable in banking: deployment time is 15-60 minutes. 2x cost for 1 hour, once a week = negligible.
Alternative: canary deployment (gradual traffic shift) — lower cost, but slower and more complex.` },

    { level:"Intermediate", q:"What is a Helm chart? How do you manage Kubernetes deployments in banking?",
      a:`Helm is the package manager for Kubernetes. A Helm chart is a collection of YAML templates + a values file that defines all Kubernetes resources for an application.

WITHOUT HELM:
Deploy payment-service: manually apply 6-8 YAML files (Deployment, Service, ConfigMap, Secret, HPA, PodDisruptionBudget, NetworkPolicy, ServiceAccount).
Manage different values for dev/staging/production: copy-paste YAML with manual find-replace. Error-prone.

WITH HELM:
helm install payment-service ./payment-service-chart --values values-prod.yaml
One command deploys all resources with environment-specific values.

CHART STRUCTURE:
payment-service-chart/
  Chart.yaml           # chart metadata (name, version, app version)
  values.yaml          # default values
  values-staging.yaml  # staging overrides
  values-prod.yaml     # production overrides
  templates/
    deployment.yaml    # Deployment template
    service.yaml       # Service template
    hpa.yaml           # HorizontalPodAutoscaler
    networkpolicy.yaml # NetworkPolicy (security)
    configmap.yaml     # ConfigMap

BANKING DEPLOYMENT MANAGEMENT:

ENVIRONMENT PROMOTION:
Same chart, different values:
• Dev: replicas: 1, resources: {cpu: 100m, memory: 256Mi}
• Staging: replicas: 2, resources: {cpu: 500m, memory: 1Gi}
• Production: replicas: 10, resources: {cpu: 2000m, memory: 4Gi}

SECRETS MANAGEMENT:
Never put secrets in Helm values. Use:
• External Secrets Operator: syncs secrets from HashiCorp Vault to Kubernetes Secrets automatically.
• sealed-secrets: encrypted secrets in Git (public key encryption, only cluster can decrypt).

DEPLOYMENT HISTORY:
helm history payment-service  → shows all releases with timestamps
helm rollback payment-service 3  → roll back to revision 3
Audit: who deployed which version when.

HELM IN CI/CD:
Pipeline stages:
helm lint → helm template → helm diff (shows what will change) → human approval → helm upgrade --install --wait
--wait: pipeline waits until all pods are healthy before marking deployment successful.
--timeout 300s: fail deployment if pods don't become healthy within 5 minutes.` },

    { level:"Advanced", q:"Design a secure CI/CD pipeline for a banking microservice.",
      a:`A banking CI/CD pipeline must balance speed with security, compliance, and auditability.

STAGE 1 — CODE COMMIT:
• Pre-commit hooks (run on developer's machine):
  - Secret detection: gitleaks or truffleHog → reject if credentials found in code
  - Code formatting: consistent code style
• Commit signature: GPG-signed commits only — prove identity of committer
• Branch protection: no direct push to main; PR requires 2 approvals
• Audit: every commit linked to JIRA ticket (commit message contains ticket ID)

STAGE 2 — BUILD:
• Reproducible build: Docker image from pinned base image (specific digest, not :latest tag)
• Dependency resolution from internal Nexus/Artifactory (no internet access during build — supply chain security)
• Dependency vulnerability scan: OWASP Dependency Check or Snyk → fail build on HIGH+ CVEs
• SBOM (Software Bill of Materials): generate list of all libraries and versions → stored in artifact registry

STAGE 3 — STATIC ANALYSIS (SAST):
• SonarQube with security rules: SQL injection patterns, hardcoded credentials, insecure random usage
• Custom rules for banking: missing maker-checker annotations, missing audit log calls
• Quality gate: fail if critical SAST findings or code coverage drops below 80%
• NOT a blocker for informational/minor findings — only blocking for critical security issues

STAGE 4 — CONTAINER BUILD AND SCAN:
• Build Docker image
• Trivy image scan: check OS packages and application dependencies for CVEs
• Dockerfile best practices: non-root user, read-only filesystem, no privileged
• Sign image with Cosign (supply chain security): cryptographic proof this image wasn't tampered with
• Push to internal container registry (not public Docker Hub)

STAGE 5 — STAGING DEPLOYMENT:
• Helm upgrade to staging namespace
• Run integration tests against staging: payment flows, auth flows, failure scenarios
• DAST (Dynamic Application Security Testing): OWASP ZAP scan of staging APIs
• Contract tests: Pact — verify API contracts with dependent services
• Performance baseline: Gatling load test → fail if p99 regressed > 20% vs baseline

STAGE 6 — APPROVAL GATE:
• Automated: all tests pass, no blocking security findings, performance baseline met
• Manual approval required for production (banking requirement):
  - Change Management System: ticket approved by Change Advisory Board
  - Second human approval in pipeline
  - Production deployments blocked during: month-end, major holidays, RBI reporting windows

STAGE 7 — PRODUCTION:
• Blue-green or canary deployment
• Smoke tests: automated happy-path tests immediately post-deployment
• Automatic rollback trigger: if error rate > 0.5% within 10 minutes of deployment → auto-rollback
• Deployment event: logged to audit system with (committer, approvers, artifact hash, timestamp)

FULL AUDIT TRAIL (RBI requirement):
Every pipeline run stores: git commit hash, test results summary, approval records, deployment timestamp, artifact version.
Retained 3 years. Auditor access: read-only view.` },

    { level:"Advanced", q:"How do you manage configuration across multiple environments in banking?",
      a:`Configuration management ensures each environment (dev, staging, UAT, production) has the correct settings without exposing secrets or requiring manual changes.

CONFIGURATION TYPES:

NON-SENSITIVE CONFIGURATION (environment-specific):
• Database host, port, pool size
• Kafka broker addresses
• Feature flags
• Log levels
• Rate limit thresholds
Store in: Kubernetes ConfigMaps (mounted as environment variables or files).

SENSITIVE CONFIGURATION (secrets):
• Database passwords
• API keys (NPCI, SMS provider, bureau)
• TLS certificates
• Encryption keys
NEVER in: code, Git, ConfigMaps. Store in: HashiCorp Vault → External Secrets Operator → Kubernetes Secrets.

ENVIRONMENT-SPECIFIC VALUES:
Helm values files per environment:
values-dev.yaml: db_pool_size: 5, log_level: DEBUG, rate_limit: 1000
values-staging.yaml: db_pool_size: 20, log_level: INFO, rate_limit: 5000
values-prod.yaml: db_pool_size: 100, log_level: WARN, rate_limit: 10000

FEATURE FLAGS (runtime configuration without deployment):
Some config changes don't need a deployment — just a flag change.
Tools: LaunchDarkly, Unleash (self-hosted for banking data sovereignty).
Banking use: 
• Gradually roll out new payment routing (enable for 1% of accounts first)
• Kill switch: instantly disable a problematic feature without deployment
• RBI mandated changes: activate on exact date without deployment
Feature flag changes: audited (who changed which flag, when).

CONFIG VERSIONING:
All non-secret config in Git. Changes require PR review.
ConfigMap changes are tracked in Git history — who changed the DB pool size and when.

CONFIGURATION DRIFT DETECTION:
Production config should match what's in Git. If someone manually edits a ConfigMap in production (bypassing process), alert.
Tool: Flux CD (GitOps) — continuously reconciles cluster state to match Git. Unauthorized manual changes reverted automatically.

12-FACTOR APP PRINCIPLE:
Config injected via environment variables, not baked into Docker image.
Same Docker image deploys to dev, staging, production — environment determined by config, not image.
Enables: rolling back code without rolling back configuration.` },
  ]
};

const DOMAIN_ARCH = {
  id: "arch", title: "Architecture Patterns", icon: "🏛️", color: "#06b6d4",
  qa: [
    { level:"Basic", q:"What is a microservices architecture? How does it compare to monolith for banking?",
      a:`MONOLITH: Single deployable unit containing all functionality. All code in one process, one database, deployed together.

Banking monolith example: one application handles accounts, payments, loans, notifications, reporting — all in one WAR/JAR.

MICROSERVICES: System split into small, independently deployable services. Each service owns its domain and data.

Banking microservices example:
• Account Service: account lifecycle, balance
• Payment Service: payment processing
• Fraud Service: fraud detection
• Notification Service: SMS/email/push
• Loan Service: loan origination and management
• Reporting Service: statements, regulatory reports
Each independently deployed, scaled, and operated.

COMPARISON:

MONOLITH:
Pros: Simple deployment (one thing to deploy), easy local development, no distributed system complexity, strong consistency (one DB).
Cons: Scale the whole app even if only payments need more resources. One bug can crash everything. Long deployment cycles. Technology lock-in.
Good for: early stage, small team, simple requirements.

MICROSERVICES:
Pros: Independent scaling (scale fraud service separately during peak fraud), independent deployment (deploy payment fix without touching loan service), technology flexibility (fraud service uses Python for ML).
Cons: Distributed system complexity (network failures, data consistency), operational overhead (50 services to monitor), inter-service communication latency.
Good for: large teams, complex domains, different scaling requirements per domain.

BANKING REALITY:
Most Indian banks: legacy monolith (CBS) with modern microservices built around it.
New digital banks/fintechs: microservices from day one.
Migration: Strangler Fig pattern — incrementally extract services from monolith without big-bang rewrite.

ANTI-PATTERN — Distributed monolith:
Microservices that are all synchronously coupled (A calls B calls C calls D) and must be deployed together. Worst of both worlds. Common mistake when teams adopt microservices without changing their architecture thinking.` },

    { level:"Basic", q:"What is the strangler fig pattern? How is it used for modernising legacy banking systems?",
      a:`Strangler Fig pattern: incrementally replace a legacy system by building new functionality alongside it, gradually routing traffic away from the old system until it's fully replaced. Named after the strangler fig tree that grows around its host.

WHY NOT BIG-BANG REWRITE:
Big-bang: stop all development, rewrite everything from scratch, switch over.
Risk: 2-year project, unclear requirements, lost institutional knowledge, high probability of project cancellation or catastrophic failure.
Banking reality: big-bang rewrites of core banking systems have failed at major banks costing hundreds of crores and years.

STRANGLER FIG APPROACH:
Phase 1 — IDENTIFY: Pick one capability (e.g., notifications) to extract from monolith.
Phase 2 — BUILD: Build the new Notification Microservice alongside the monolith. Both exist simultaneously.
Phase 3 — INTERCEPT: Route new notification requests to the new service. Monolith still handles existing traffic.
Phase 4 — MIGRATE: Gradually move existing notification functionality to new service.
Phase 5 — STRANGLE: Monolith's notification code is now dead code. Remove it.
Repeat for next capability.

BANKING EXAMPLE — Extracting UPI from monolith:
1. New UPI Service built as microservice with NPCI integration.
2. API Gateway routes /upi/* to new service, all other traffic to monolith.
3. UPI Service has its own DB, calls monolith's account API for balance/debit.
4. Over 6 months: UPI fully handled by new service. Monolith's UPI code removed.
5. Next: extract Notifications... then Fraud Detection... then Accounts.

TECHNICAL ENABLERS:
• API Gateway: route traffic based on path/feature flag (old vs new)
• Feature flags: gradually shift % of traffic to new service
• Dual-write period: write to both old and new systems simultaneously, validate consistency before full cutover
• Observability: monitor both old and new side-by-side to detect regressions` },

    { level:"Intermediate", q:"What is the API first design approach? How do you apply it in banking?",
      a:`API First: design the API contract before writing any implementation code. The API contract (OpenAPI/Swagger spec) is the source of truth that drives development.

TRADITIONAL APPROACH:
Build backend → generate API docs from code → clients implement against docs.
Problem: API shape driven by database schema / internal design, not client needs. Contract discovered late. Multiple teams blocked on each other.

API FIRST APPROACH:
All stakeholders (backend, mobile, web, third-party) design the API spec together first.
API spec (OpenAPI YAML) reviewed and approved.
Parallel development: backend implements against spec, frontend mocks against spec, tests written against spec.
Integration: all sides already match the contract.

PROCESS:

DESIGN:
POST /api/v1/payments
Request: { from_account, to_account, amount, currency, idempotency_key, description }
Response 200: { payment_id, status, created_at, estimated_completion }
Response 422: { error_code, message, field_errors[] }
Response 409: { error_code: "DUPLICATE_PAYMENT", original_payment_id }

REVIEW:
• Can client always know what to display? (are status codes clear?)
• Is error response actionable? (does client know what to fix?)
• Is pagination included for list endpoints?
• Is versioning strategy clear?

MOCK SERVER:
Generate mock server from OpenAPI spec → Prism or Stoplight.
Frontend team develops against mock server (no backend dependency).
Exact same contract → integration "just works."

BANKING BENEFITS:
• RBI Open Banking mandates: API spec published publicly. API First ensures the spec IS the implementation.
• Multiple consumers (mobile app, web portal, corporate ERP integration) all consume the same well-designed API.
• Contract testing (Pact) verifies implementation matches spec continuously in CI/CD.
• Third-party integration: fintech partners consume your API. Well-designed API = less support burden.

SCHEMA DESIGN PRINCIPLES FOR BANKING APIs:
• Use snake_case consistently (not camelCase — international standards)
• Amounts always in minor units (paise, not rupees) — avoids decimal precision issues
• Dates: ISO 8601 (2024-01-15T14:32:00+05:30)
• Pagination: cursor-based (not offset) for transaction history (large datasets)
• Error codes: machine-readable enum (INSUFFICIENT_FUNDS, INVALID_ACCOUNT) + human message` },

    { level:"Intermediate", q:"What is the Anti-Corruption Layer (ACL) pattern? When is it used in banking?",
      a:`The Anti-Corruption Layer is a translation layer between your modern microservice and a legacy system (or external system) that has an incompatible model. It prevents the legacy system's messy model from "leaking" into your clean domain model.

WHY IT'S NEEDED IN BANKING:
Core Banking System (CBS) like Finacle or FLEXCUBE has:
• Cryptic field names (ACCTNO, CIFID, DRBAL, CRBAL)
• SOAP/XML interfaces from the 2000s
• Business logic embedded in the response format
• Account balance in a field called "DRBAL" (debit balance — which for asset accounts means the credit-side balance)

If your new Payment Service calls CBS directly and uses CBS's model, CBS's complexity leaks into your code:
"What does DRBAL mean again? Is DRBAL the current balance or available balance?"
This confusion spreads across every service that talks to CBS.

ACL SOLUTION:
Create an Account Service that:
• Translates CBS's cryptic model to your clean domain model
• Acts as the only service that ever knows about CBS internals
• Exposes clean, well-named APIs to the rest of your system

CBS response:
{ "ACCTNO": "1234567", "CIFID": "C001", "DRBAL": 45000.00, "AVLBAL": 44500.00 }

ACL translates to:
{ "account_id": "1234567", "customer_id": "C001", "current_balance": 45000.00, "available_balance": 44500.00 }

Every other service in your system uses the clean model and has NO knowledge of CBS internals.
If CBS changes its field names, only the ACL needs updating.

BANKING USE CASES:
• New microservices calling legacy CBS
• Integrating with NPCI's APIs (government-style API design)
• Integrating with credit bureaus (CIBIL's XML SOAP API)
• Third-party KYC providers (each has different response format)
• International correspondent banking (each bank has different message format)

ACL is a translation pattern — not a business logic layer. Keep it thin and focused on translation only.` },

    { level:"Advanced", q:"What is a domain-driven design (DDD)? How do you apply bounded contexts in banking?",
      a:`Domain-Driven Design (DDD) is an approach to software design that focuses on modelling the software around the business domain. Key concepts: Ubiquitous Language, Bounded Contexts, Aggregates, Domain Events.

UBIQUITOUS LANGUAGE:
Everyone (developers, bankers, compliance) uses the same terminology.
"Account" means the same thing in code as it does in banking conversation.
If banker says "current account" and developer models it as "transactionAccount" — confusion and bugs.

BOUNDED CONTEXT:
A business domain divided into explicit contexts, each with its own model and language.
"Account" means something different in different contexts:
• Payments context: Account = {account_id, balance, debit_capable}
• KYC context: Account = {account_id, customer_id, kyc_status, risk_rating}
• Reporting context: Account = {account_id, monthly_average_balance, transaction_count}

Same entity, different representations in different bounded contexts.
Forcing one Account model to serve all contexts creates a "God object" that's too complex for any one use.

BANKING BOUNDED CONTEXTS:

PAYMENT CONTEXT:
Entities: Payment, PaymentMethod, Beneficiary
Language: initiate, authorise, settle, reverse
Commands: InitiatePayment, AuthorisePayment
Events: PaymentInitiated, PaymentAuthorised, PaymentSettled, PaymentFailed

ACCOUNT CONTEXT:
Entities: Account, Balance, AccountHolder
Language: debit, credit, freeze, close
Commands: DebitAccount, CreditAccount
Events: AccountDebited, AccountCredited, BalanceUpdated

FRAUD CONTEXT:
Entities: Transaction (read-only, from events), FraudCase, RiskScore
Language: screen, flag, investigate, clear
Commands: ScreenTransaction
Events: FraudAlertRaised, FraudCaseOpened, TransactionCleared

COMPLIANCE CONTEXT:
Entities: AMLCase, SARReport, CustomerRiskProfile
Language: monitor, report, file, investigate
Commands: RaiseSTR (Suspicious Transaction Report)
Events: STRFiled, AMLCaseOpened

CONTEXT MAPPING (how contexts communicate):
• Shared Kernel: two contexts share a small subset of domain model (must coordinate changes)
• Customer-Supplier: Payment context (downstream) consumes events from Account context (upstream)
• Anti-Corruption Layer: legacy CBS context needs ACL to avoid CBS model leaking
• Open Host Service: Reporting context exposes a public API (Swagger documented) that any other context can consume

AGGREGATE DESIGN:
An Aggregate is a cluster of objects treated as a unit for data changes.
Payment aggregate: { Payment + PaymentLineItems + FxConversion }
Rule: modifications to an aggregate go through the root (Payment), never directly to children.
Why: maintains invariants ("payment can't be partially applied — all line items settle together or none")
Size guideline: small aggregates → less contention. Large aggregates → more contention (everyone needs to lock the whole thing). In banking: Payment aggregate should NOT include Account — decouple via events.` },

    { level:"Expert", q:"How do you design a system that handles 99.999% availability (five nines) for a critical banking service?",
      a:`99.999% availability = 5.26 minutes of downtime per year. Achieving this requires eliminating every single point of failure, at every layer.

FIVE-NINES MATH:
99.9% = 8.7 hours downtime/year
99.99% = 52 minutes/year
99.999% = 5.26 minutes/year
Most banking: 99.95-99.99%. 99.999% for truly critical (RTGS, core payment rails).

ELIMINATING SINGLE POINTS OF FAILURE:

COMPUTE LAYER:
• Minimum 3 pods per service (one pod failure doesn't reduce capacity below SLO)
• Pods spread across minimum 3 availability zones (one AZ failure loses 33% capacity, not 100%)
• Pod Disruption Budget: Kubernetes won't evict more than 1 pod at a time during maintenance
• No single node hosts majority of pods (topology spread constraints)

NETWORK LAYER:
• Multiple load balancers (active-active), each in different AZ
• BGP anycast for DNS — multiple IP endpoints, traffic routes to nearest healthy endpoint
• Multiple ISP connections at data centre (internet diversity)
• Private direct connect to NPCI, RBI — not dependent on public internet

DATABASE LAYER:
• PostgreSQL with synchronous replication (2 replicas — commit only when at least 1 replica acknowledges)
• Patroni automatic failover: primary failure → replica promoted within 30 seconds
• Connection pooling (PgBouncer): if primary switches, pool reconnects — application sees brief latency, not failure
• Read replicas: balance reads distributed, primary handles only writes

CACHE LAYER:
• Redis Cluster: 3 primary shards + 3 replicas. One shard failure: 2 remaining serve traffic (degraded but functional)
• Application handles Redis failure gracefully: fall back to DB (slower, but functional)
• Never let cache failure cause service failure: circuit breaker around Redis, fallback to DB

DEPENDENCY MANAGEMENT:
• Every external dependency has a circuit breaker + timeout
• Graceful degradation plan for each dependency:
  CBS unavailable → serve from cache, queue writes for retry
  Fraud service unavailable → allow transactions with manual review flag
  SMS provider unavailable → queue notifications for retry, show in-app notification
• Never let one dependency failure cascade to complete service unavailability

DEPLOYMENT (five-nines compatible):
• Blue-green: zero-downtime deployment (sub-second traffic switch)
• Automated rollback: if error rate spikes post-deployment → auto-rollback
• Change freeze windows: no deployments during peak hours, month-end

CHAOS ENGINEERING:
• Regularly test: kill a pod → service recovers in < 30 seconds?
• Kill an AZ: service degrades gracefully, auto-scales in remaining AZs?
• Introduce 500ms latency to CBS: circuit breaker trips? Fallback activates?
• Crash primary DB: Patroni promotes replica in < 30 seconds? Application reconnects?
Practice failure recovery so it's automatic, not panicked.

MEASURING:
Define SLI: (successful requests) / (total requests)
Measure: every 30 seconds, calculate availability over rolling 1-hour window
Alert: burn rate > 10x → within 1 hour this anomaly will consume the weekly error budget → immediate response required` },

    { level:"Expert", q:"How do you architect a banking platform for extensibility as business requirements evolve?",
      a:`Banking requirements evolve constantly: new RBI regulations, new payment methods, new products, new integrations. Architecture must accommodate change without constant re-architecture.

EXTENSIBILITY PRINCIPLES:

1. OPEN/CLOSED PRINCIPLE AT SYSTEM LEVEL:
Systems should be open for extension, closed for modification.
New payment type (UPI Credit) should be addable without modifying existing payment processing code.
Implementation: plugin architecture, strategy pattern, event-driven extension points.

2. EVENT-DRIVEN EXTENSION POINTS:
Every significant action publishes an event.
New functionality subscribes to existing events — no modification of existing code.
Example: New "Carbon Footprint Calculator" feature needs to track spending categories.
Without events: modify payment processing to calculate carbon score.
With events: Carbon service subscribes to payment.completed events → calculates asynchronously → stores results.
Payment service unchanged. Carbon service fully independent.

3. FEATURE FLAG DRIVEN ARCHITECTURE:
New features deployed behind flags (disabled by default).
Enable for specific customers, regions, or percentages.
Gradual rollout without code deployment per incremental rollout.
Rollback: disable flag instantly (vs code rollback = minutes).

4. ANTI-CORRUPTION LAYERS FOR EXTERNAL DEPENDENCIES:
Wrap every external system (NPCI, CBS, bureau) in an ACL.
When NPCI changes their API: only the ACL changes. Zero impact on internal services.
When switching SMS providers: update SMS provider ACL → all services that "send SMS" are unaffected.

5. CONFIGURATION-DRIVEN BUSINESS RULES:
Business rules that change frequently (interest rates, fee structures, transaction limits) → store in configuration, not code.
Rule engine (Drools) or simple DB-backed configuration.
New fee structure: ops team updates configuration → takes effect immediately, no deployment.
Rate changes: CBS-specific but same principle.

6. DOMAIN EVENT SCHEMA VERSIONING:
Events must be versionable. New consumers may require richer events; old consumers must still work with old events.
Strategy: Event Schema Registry + backward-compatible additions only.
Never remove event fields — add new, optional fields.

7. API VERSIONING STRATEGY:
Public APIs: URI versioning (/v1, /v2). Support N-1 versions simultaneously (at least 1 year overlap).
Internal APIs: semantic versioning + backward compatibility requirement.
Breaking changes require: migration guide, dual-support period, consumer notification.

PRACTICAL EXAMPLE — Adding a new payment corridor (India-UAE):
Without extensibility: modify payment service to handle UAE currency, UAE routing, UAE compliance.
With extensibility:
• Payment service has a PaymentCorridor interface (strategy pattern)
• New UAEPaymentCorridor implementation registered as a new strategy
• Feature flagged behind: new_corridor_uae
• Enable for test users → validate → gradually roll out
• Existing corridors (India-US, India-UK) completely unmodified` },
  ]
};

const DOMAIN_BEH = {
  id: "beh", title: "Behavioral & Leadership", icon: "🎯", color: "#ec4899",
  qa: [
    { level:"Basic", q:"Tell me about yourself. How would you describe your technical background?",
      a:`STRUCTURE: Current role → Key technical expertise → What makes you distinctive → What you're building toward.

SAMPLE FRAMEWORK (adapt with your own facts):

"I'm a senior software engineer with [X] years of experience, currently working on a corporate banking platform for [client type] in Hyderabad. My work spans system architecture, payment integrations — UPI, NACH, SWIFT — and building systems that have to be reliable, secure, and compliant with RBI and NPCI guidelines.

What I've developed particularly deeply is the intersection of system design and banking domain knowledge — understanding not just how to build distributed systems, but why certain design decisions exist because of the regulatory and financial context. For example, understanding why idempotency isn't just a nice-to-have in payments — it's the difference between a customer being charged once or twice.

I've done significant R&D work on [specific area], which has given me experience with ambiguous problem spaces where you're not just implementing known solutions but figuring out the right approach.

Beyond the technical, I've been developing my ability to communicate technical complexity to non-technical stakeholders — translating why a 3-week timeline is realistic for a given integration, and what the business risk is of compressing it.

I'm currently deepening my expertise in [specific domain from your mastery plan] and working toward positioning myself as a technical authority in the banking systems space."

KEY PRINCIPLES for "tell me about yourself":
• Lead with current context and impact, not your CV chronology
• One or two specific technical accomplishments (real numbers if possible)
• Distinctive angle — what makes your profile different from other senior engineers?
• Forward-looking — what you're building toward (shows ambition and self-awareness)
• Keep to 2-3 minutes — this is an opener, not a monologue` },

    { level:"Basic", q:"Why do you want to leave your current role?",
      a:`This question tests: self-awareness, professionalism, genuine motivation.

WHAT INTERVIEWERS ARE ACTUALLY CHECKING:
• Do you badmouth previous employers? (red flag — you'll badmouth them too)
• Is your reason legitimate? (seeking growth vs running from a bad situation)
• Does your reason align with what this new role offers?

FRAMEWORK — Lead with growth, not grievance:

POSITIVE FRAMING:
"I've had a strong foundation at [current employer] — I've built real expertise in banking system design, payment integrations, and R&D-type work. What I'm looking for now is [specific thing this role offers that current role doesn't].

I want to work on [larger scale / different domain / stronger tech culture / product with more impact] and I've reached a point where this specific opportunity aligns better with where I want my career to go in the next 3-5 years."

LEGITIMATE REASONS (frame positively):
• Seeking technical leadership opportunity (if current role has a ceiling)
• Want to work on a specific domain area this role offers
• Seeking larger scale or more complex problems
• Compensation (be honest if asked directly, don't volunteer it)
• Career progression that current role can't offer in a reasonable timeframe

WHAT TO AVOID:
• "My manager is difficult / toxic" — even if true, don't say this
• "The company is poorly managed" — reflects poorly on your judgment too
• "I'm not learning anything" — sounds passive. Better: "I've mastered this domain and want to apply it to new challenges."
• Vague: "I'm just looking for a change" — no motivation

If you have a specific genuine concern (stability, growth ceiling, culture): you can mention it diplomatically. "The current role has been rewarding, but the growth trajectory isn't where I need it to be for the next phase of my career."` },

    { level:"Basic", q:"What is your greatest technical strength? What area do you want to improve?",
      a:`STRENGTH:
Choose something genuinely true that is also relevant to the role. Don't be generic ("I'm a hard worker"). Pick a specific technical strength with evidence.

EXAMPLE FRAMEWORK:
"My strongest area is [specific domain]. What makes it a genuine strength rather than just familiarity is [what you've done with it / how deep your understanding is / what problems you've solved with it].

For example, [specific instance where this strength mattered — real situation, real outcome].

In a banking context specifically, this translates to [how it's relevant to financial systems]."

BANKING-RELEVANT STRENGTHS TO CHOOSE FROM:
• System design for distributed financial systems (with specific example)
• Understanding compliance requirements and translating them to technical design
• Debugging complex distributed system issues under production pressure
• Domain expertise in [UPI/SWIFT/NACH/CBS integration]
• Ability to evaluate multiple approaches and make defensible architectural decisions

IMPROVEMENT AREA:
Be genuine but strategic. Choose something real that:
a) you're actively working on (shows self-awareness + action)
b) is not a critical skill for the job you're applying for

EXAMPLE:
"I'm actively working on improving my ability to communicate technical complexity to senior business stakeholders. I'm a strong technical communicator with engineers, but I want to get better at the concise executive summary — the one-pager that gets a technical decision approved without requiring the decision-maker to understand the technical details.

I've been doing this deliberately: in the last two months, I've written [X] architecture decision records and gotten feedback from our business team on what was and wasn't clear to them."

This answer:
• Shows self-awareness
• Shows you're proactive about improvement
• Isn't a red flag for a technical role
• Gives a concrete example of what you're doing about it` },

    { level:"Intermediate", q:"Describe a technical decision you made under uncertainty. What was your approach?",
      a:`STRUCTURE: Situation → What was uncertain → Decision framework you applied → Decision made → Outcome → What you learned

WHAT INTERVIEWERS ARE LOOKING FOR:
• Structured thinking under ambiguity (not paralysis, not random guessing)
• Ability to identify the crux of the uncertainty
• Pragmatic approach — not waiting for perfect information
• Willingness to own the decision and learn from outcomes

FRAMEWORK ANSWER (adapt with your own situation):

"In our banking integration project, we needed to choose the messaging architecture for real-time transaction processing. The decision had to be made within a week — no time for a full PoC.

What was uncertain: our team had strong RabbitMQ experience; Kafka would require new operational knowledge. But volume projections suggested we could outgrow RabbitMQ within 18 months, requiring a painful migration at exactly the wrong time (when the system is under full production load).

My approach:
First, I identified the irreversible vs reversible aspects. Choosing Kafka and discovering it was wrong: expensive but manageable (operational learning curve). Choosing RabbitMQ and needing to migrate at scale: potentially much more costly.

Second, I consulted one external person who had made this decision for a similar fintech. One focused conversation, not a committee.

Third, I proposed a risk-mitigation middle path: Kafka for the high-volume transaction pipeline (where the volume risk was real), RabbitMQ for notification delivery (lower volume, where our existing expertise was a genuine asset).

The outcome: 18 months later, transaction volume confirmed the projection. The Kafka decision held. The RabbitMQ piece was later replaced for different reasons.

What I learned: for decisions with asymmetric consequences — where getting it wrong in one direction is much more costly than the other — bias toward the more conservative choice on the expensive-to-reverse side. The operational learning curve of Kafka was bounded and manageable. The technical debt of migration at scale was unbounded and would have been disruptive."` },

    { level:"Intermediate", q:"How do you handle disagreements with a technical decision made by your team or manager?",
      a:`This tests: professional maturity, ability to advocate for technical positions, ability to commit and move forward.

FRAMEWORK — "Disagree and commit":

STEP 1 — UNDERSTAND FIRST:
"Before I push back on a decision, I make sure I understand it fully. Sometimes what looks like a wrong decision makes sense when I understand constraints I wasn't aware of — budget, timeline, compliance, political context."

STEP 2 — RAISE THE CONCERN PRIVATELY AND SPECIFICALLY:
"I raise concerns one-on-one with the decision-maker, with specific technical reasoning — not 'I don't think this is right' but 'I'm concerned about X because in our payment processing context, Y can lead to Z. Here's what I think could happen: [specific failure mode]. Here's an alternative that addresses the same requirement: [alternative].'

I don't raise concerns in group settings first — that puts people on the defensive. Private conversation first."

STEP 3 — ACCEPT THE DECISION AND COMMIT:
"If the decision stands after I've raised my concern, I commit to it fully. I don't implement it halfheartedly or keep raising the issue. The team needs to move forward.

I do document my concern — in a comment, an ADR (Architecture Decision Record), or an email trail — not to say 'I told you so' later, but so that if the issue materialises, we have the context to understand what happened and fix it faster."

STEP 4 — IF IT GOES WRONG:
"I don't say 'I told you so.' I say 'this is the situation we're in, here's how I think we fix it.' The goal is always to move the project forward."

BANKING-SPECIFIC EXAMPLE (if asked):
"We had a situation where a timeline was compressed for a payment gateway integration in a way I thought created compliance risk — specifically around audit logging completeness. I raised this specifically with my manager: 'If we skip the detailed transaction log for this release, we may have a gap in our audit trail that could be an issue in an RBI inspection.' The decision was to proceed with a simplified log for now and complete it in the next sprint. I documented the gap and flagged it for the next sprint. We completed it on time."` },

    { level:"Intermediate", q:"How do you handle working on an R&D problem with no clear solution path?",
      a:`This question is specifically relevant given your current role. The interviewer wants to understand your approach to open-ended, ambiguous technical problems.

WHAT MAKES R&D DIFFERENT FROM REGULAR DEVELOPMENT:
Regular development: requirements clear, solution known, execution is the challenge.
R&D: problem clear, solution unknown, discovery is the process.
The failure mode in R&D: treating it like regular development (fixed timeline, waterfall approach) → either cut scope or miss deadline.

MY APPROACH FRAMEWORK:

1. SCOPE THE UNKNOWN:
"The first thing I do with any R&D problem is try to distinguish: what do I know, what don't I know, and what do I need to know to make progress?

I map the uncertainty: is it technical uncertainty (can this be done at all?), domain uncertainty (what does the business actually need?), or integration uncertainty (will the external system cooperate?)."

2. TIME-BOX EXPLORATION:
"I work in explicit time-boxed exploration phases, not open-ended research.
'I'll spend 2 days trying approach A and approach B. At the end of 2 days, I'll have a view on which is more promising or why both are wrong.'
This creates checkpoints for communicating progress to management without false precision."

3. COMMUNICATE UNCERTAINTY HONESTLY:
"I tell management: 'This is research, not development. I can't give you a completion date the way I can for known work. I can give you: what I'll know after 2 weeks of investigation, and when I'll be able to estimate the implementation timeline.'
This resets expectations appropriately."

4. BUILD QUICK THROWAWAY PROTOTYPES:
"Rather than designing the full solution upfront, I build the smallest possible thing that answers the most important unknown question. Throwaway proof-of-concept that answers: 'can the NPCI system support this pattern?' The POC code doesn't go to production — the answer from the POC informs the real design."

5. DOCUMENT THE DEAD ENDS:
"I document what I tried and why it didn't work. In R&D, dead ends are results. They prevent teammates from retrying the same approach and give future context for why the final solution looks the way it does."` },

    { level:"Advanced", q:"How do you mentor junior engineers? What is your philosophy?",
      a:`WHAT INTERVIEWERS ARE LOOKING FOR:
At senior engineer level, your impact multiplies through people, not just code. This question tests whether you understand leverage through others.

MY PHILOSOPHY:

1. TEACH THINKING, NOT JUST ANSWERS:
"When a junior engineer brings me a problem, my first response is rarely to give the answer. It's to ask: 'What have you tried? What do you think the issue might be? What does the error/data tell you?'
The goal is to build their diagnostic reasoning, not create a dependency on me.
If I always give the answer, I'm a crutch. If I help them find the answer, I'm building capacity."

2. CREATE SAFE-TO-FAIL SPACE:
"Junior engineers often fear making mistakes publicly. I try to create an environment where asking questions is safe — where 'I don't understand this' is welcomed, not judged.
In banking specifically, where 'I wasn't sure' can sound like incompetence, this matters. I'd rather junior engineers ask than implement something uncertain and find out in production."

3. CODE REVIEW AS A TEACHING TOOL:
"I write code review comments as questions and explanations, not just corrections.
Not: 'Wrong — this should be parameterised.'
Instead: 'This approach embeds user input directly in the SQL — in a banking context, what happens if a customer enters something unexpected? Look up SQL injection. Here's how parameterised queries address it.'
The reasoning is the teaching, not just the fix."

4. GIVE OWNERSHIP, NOT JUST TASKS:
"I assign junior engineers ownership of a small, complete thing — not just subtasks.
'You own the notification service for this sprint. You design it, build it, test it, deploy it. I'm available for consultation and will review, but the decision-making is yours.'
Ownership develops judgment. Tasks develop execution."

5. CALIBRATE TO EACH PERSON:
"Some junior engineers need more structure and explicit guidance. Others need space and get demotivated by over-direction.
I spend the first few weeks understanding which mode works for each person before defaulting to a standard approach."` },

    { level:"Advanced", q:"How do you communicate technical complexity to non-technical management?",
      a:`This is one of the highest-leverage senior engineer skills — especially critical in R&D banking roles.

CORE PRINCIPLE:
Management doesn't need to understand the technology. They need to understand three things:
• What is the business risk?
• What are their options?
• What do you recommend?

FRAMEWORK FOR TECHNICAL COMMUNICATION:

1. LEAD WITH BUSINESS IMPACT, NOT TECHNICAL DETAIL:
WRONG: "We need to implement idempotency in the payment API because distributed systems can have duplicate message delivery which in a payment context..."
RIGHT: "There's a risk that in certain network failure scenarios, a customer could be charged twice for the same payment. Here's what we need to do to prevent that, and how long it will take."

Same information. The second version tells management what they need to make a decision.

2. PRESENT OPTIONS WITH CLEAR TRADE-OFFS:
Option A: Full fix — 3 weeks. Eliminates risk completely.
Option B: Partial fix — 1 week. Reduces risk by 90%. Residual risk: if customer retries within 30 minutes, possible duplicate. Probability: low.
Option C: Do nothing. Risk: in high-volume scenarios, estimated 0.001% transaction duplication rate.

"I recommend Option A because the fix is straightforward and the cost of a duplicate charge incident — customer trust, remediation, potential RBI notification — exceeds the 2-week cost."

3. CALIBRATE TO YOUR AUDIENCE:
Does this manager think in terms of risk? → Frame as risk probability and impact.
Does this manager think in cost? → Frame as cost of fix vs cost of incident.
Does this manager care about timelines above all? → Lead with timeline, then risk.

4. FOR TIMELINE COMMUNICATION:
"I can give you high confidence in [specific thing], but low confidence in [other thing] until [milestone].
By [date], I'll know [what you'll know]. At that point, I can give you a more precise estimate for [next phase]."
Never give a false-precision date. Give a confidence-rated estimate.

5. REGULAR STATUS UPDATES:
Weekly written update (email or Confluence): What's done. What's at risk. What do I need from you.
Never more than one page. Decision-makers read on mobile between meetings.
Mention if everything is on track — don't only communicate problems.` },

    { level:"Expert", q:"How do you approach technical debt in a high-pressure banking delivery environment?",
      a:`Technical debt is inevitable in banking — regulatory deadlines, MVP launches, and resource constraints create it. The question is whether it's managed deliberately or allowed to compound silently.

CATEGORISING DEBT (not all debt is equal):

TYPE 1 — DELIBERATE, PRUDENT (acceptable, manageable):
"We know this design is suboptimal but the business decision was made to ship now and address it in sprint N+2."
Manageable because it was conscious, documented, and scheduled.

TYPE 2 — INADVERTENT (most dangerous):
"We didn't know there was a better approach when we wrote this."
Discovered in code reviews, incidents, performance issues.
Priority: address as soon as discovered.

TYPE 3 — COMPLIANCE DEBT (zero tolerance):
Any shortcut creating regulatory risk: missing audit logs, unencrypted PII, incomplete maker-checker, missing RBI-required fields.
Non-negotiable: fix before next audit, regardless of delivery pressure.
Frame to management: "This is a regulatory compliance issue, not a technical preference."

MAKING DEBT VISIBLE:
Maintain a technical debt register (Jira epic or Confluence page) — not as a shame list but as a business risk register.
Each item: description, risk if not fixed, estimated fix effort, business impact of deferring.

Example entry:
Debt: Payment service has no circuit breaker around Account Service calls.
Risk: Account Service degradation → Payment Service thread pool exhaustion → Payment Service outage. Estimated probability: medium. Impact: ₹X million per hour.
Fix: 3 days.
Decision: accept for 2 sprints, fix in sprint N+3.

BUSINESS LANGUAGE FOR DEBT:
"Our reconciliation batch job takes 4 hours to run. As transaction volume grows at current rate, it will take > 8 hours within 6 months, meaning reconciliation misses its overnight window. Fixing the database indexing and query efficiency will take 5 days and bring runtime to 45 minutes with 10x headroom."

Management understands timelines and risk. Not "we have an O(n²) algorithm that needs optimisation."

NEGOTIATE THE DEBT BUDGET:
20% of each sprint for debt remediation. Not negotiable. Frame as maintenance: "Like servicing a vehicle — doing less of it makes future costs higher."
If management pushes back: "In the last 6 months, 30% of our unplanned work came from system fragility caused by deferred maintenance. Proactive maintenance is cheaper."

THE SENIOR ENGINEER'S ROLE:
You are the memory of technical risk in the organisation. Junior engineers may not see accumulating risk. Management doesn't see code. You translate — before it becomes a production incident, not after.` },

    { level:"Expert", q:"How do you approach system design reviews and architecture governance in a banking team?",
      a:`Architecture governance ensures technical decisions are consistent, high-quality, and aligned with the bank's technical strategy — without becoming a bottleneck.

THE TENSION:
Too little governance: each team makes independent decisions → inconsistent tech stack, duplicate solutions, security gaps, incompatible systems.
Too much governance: every decision requires committee approval → slow delivery, engineers disengage, governance becomes theatre.

GOVERNANCE MECHANISMS:

1. ARCHITECTURE DECISION RECORDS (ADRs):
Every significant technical decision documented in a standard format:
• Context: what situation necessitated this decision?
• Decision: what was decided?
• Alternatives considered: what else was evaluated and why rejected?
• Consequences: what are the trade-offs of this decision?
• Status: proposed → accepted → deprecated/superseded

Stored in version control alongside code. Searchable. Reviewable.
Light-weight: good ADR takes 1-2 hours to write, prevents 2-week debate.
Review process: author posts ADR → stakeholders comment → decision recorded.

2. RFC (REQUEST FOR COMMENTS) PROCESS:
For significant changes (new component, new tech stack addition, major integration approach):
Author writes RFC document (2-4 pages): problem, proposed solution, alternatives, open questions.
Published to tech channel: 5-business-day comment period.
Author incorporates feedback → decision accepted or further iteration.
Outcome: decision reached through written discourse, not in a single meeting where loudest voice wins.

3. ARCHITECTURE REVIEW BOARD (ARB):
NOT a committee that approves every decision.
Instead: senior engineers meeting bi-weekly to:
• Review ADRs for cross-cutting decisions
• Identify patterns: are 3 teams solving the same problem differently?
• Communicate decisions back to teams
• Track compliance with existing decisions
Quorum: 3 senior engineers. Decisions by consensus, not unanimous agreement.

4. DESIGN REVIEW FOR HIGH-RISK CHANGES:
Mandatory review before: new external integrations (NPCI, bureau, correspondent bank), schema changes to core tables, new authentication mechanisms.
Not mandatory for: implementation decisions within established patterns.
Review focus: security, compliance, reliability, operability — not code style.

5. TECH RADAR (ADOPTION GUIDANCE):
ADOPT: Recommended technologies for new work (PostgreSQL, Kafka, Spring Boot, Kubernetes).
TRIAL: Promising but not yet standard — use in one project, evaluate.
ASSESS: Worth investigating — not yet ready for production use.
HOLD: Don't use for new work (specific legacy tech, deprecated patterns).
Published and visible to all engineers. Reduces time spent on "what should we use for X?" debates.

MY APPROACH AS SENIOR ENGINEER:
I treat governance as infrastructure for decisions, not a gate that blocks progress. The goal is enabling teams to make good decisions autonomously, with lightweight checkpoints for the decisions that have cross-team impact. If I'm spending more time in governance meetings than building things or helping my team, the governance is too heavy.` },
  ]
};



// ══════════════════════════════════════════════════════════
// DOMAINS REGISTRY
// ══════════════════════════════════════════════════════════
const ALL_DOMAINS = [
  DOMAIN_SD, DOMAIN_DB, DOMAIN_BANK,
  DOMAIN_SEC, DOMAIN_MSG, DOMAIN_OBS,
  DOMAIN_PERF, DOMAIN_DEVOPS, DOMAIN_ARCH, DOMAIN_BEH
];

// ══════════════════════════════════════════════════════════
// UI COMPONENT
// ══════════════════════════════════════════════════════════
const LEVELS = {
  Basic:        { color: "#22c55e", bg: "#22c55e18", short: "B" },
  Intermediate: { color: "#3b82f6", bg: "#3b82f618", short: "I" },
  Advanced:     { color: "#f6a535", bg: "#f6a53518", short: "A" },
  Expert:       { color: "#ef4444", bg: "#ef444418", short: "E" },
};

export default function InterviewQA() {
  const DOMAINS = ALL_DOMAINS;
  const [activeDomain, setActiveDomain] = useState(DOMAINS[0].id);
  const [activeLevel, setActiveLevel] = useState("All");
  const [openQ, setOpenQ] = useState(null);
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState({});
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const domain = DOMAINS.find(d => d.id === activeDomain);

  const filtered = useMemo(() => {
    if (!domain) return [];
    return domain.qa.filter(q => {
      const levelMatch = activeLevel === "All" || q.level === activeLevel;
      const searchMatch = !search ||
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase());
      const idx = domain.qa.indexOf(q);
      const bookmarkKey = `${domain.id}-${idx}`;
      const bmMatch = !showBookmarksOnly || bookmarks[bookmarkKey];
      return levelMatch && searchMatch && bmMatch;
    });
  }, [domain, activeLevel, search, bookmarks, showBookmarksOnly]);

  const allBookmarked = useMemo(() => {
    return DOMAINS.flatMap(d =>
      d.qa.map((q, i) => ({ ...q, domainId: d.id, domainTitle: d.title, key: `${d.id}-${i}` }))
    ).filter(q => bookmarks[q.key]);
  }, [DOMAINS, bookmarks]);

  const toggleBookmark = (key, e) => {
    e.stopPropagation();
    setBookmarks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalQ = DOMAINS.reduce((s, d) => s + d.qa.length, 0);
  const bmCount = Object.values(bookmarks).filter(Boolean).length;

  const levelCounts = useMemo(() => {
    if (!domain) return {};
    return Object.keys(LEVELS).reduce((acc, l) => ({
      ...acc, [l]: domain.qa.filter(q => q.level === l).length
    }), {});
  }, [domain]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07090f",
      fontFamily: "\'Inter\',\'Segoe UI\',sans-serif",
      color: "#c8d0de",
      padding: "14px",
      maxWidth: "520px",
      margin: "0 auto",
    }}>
      {/* HEADER */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontSize: "9px", color: "#3b82f6", letterSpacing: "2px", fontWeight: 700, marginBottom: "3px", textTransform: "uppercase" }}>
          Senior Engineer · Corporate Banking · KP
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "19px", fontWeight: 800, color: "#e8edf5", margin: "0 0 3px", lineHeight: 1.2 }}>
              Interview Q&A<br/>Reference Guide
            </h1>
            <div style={{ display: "flex", gap: "10px", fontSize: "10px", color: "#4a5568" }}>
              <span>📚 {totalQ} questions</span>
              <span>🏷 {DOMAINS.length} domains</span>
              <span>⭐ {bmCount} saved</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {Object.entries(LEVELS).map(([lvl, cfg]) => (
              <div key={lvl} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: cfg.bg, border: `1px solid ${cfg.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: cfg.color, fontWeight: 800 }}>{cfg.short}</div>
                <span style={{ fontSize: "9px", color: "#4a5568" }}>{lvl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ position: "relative", marginBottom: "10px" }}>
        <input value={search} onChange={e => { setSearch(e.target.value); setOpenQ(null); }}
          placeholder={`Search all ${totalQ} questions & answers...`}
          style={{ width: "100%", padding: "9px 12px 9px 32px", background: "#0e1117", border: "1px solid #1e2535", borderRadius: "9px", color: "#c8d0de", fontSize: "12px", outline: "none", boxSizing: "border-box" }} />
        <span style={{ position: "absolute", left: "10px", top: "9px", fontSize: "12px" }}>🔍</span>
        {search && (
          <button onClick={() => setSearch("")}
            style={{ position: "absolute", right: "10px", top: "8px", background: "none", border: "none", color: "#4a5568", cursor: "pointer", fontSize: "14px" }}>✕</button>
        )}
      </div>

      {/* LEVEL FILTER */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "10px", flexWrap: "wrap" }}>
        {["All", ...Object.keys(LEVELS)].map(l => (
          <button key={l} onClick={() => { setActiveLevel(l); setOpenQ(null); }} style={{
            padding: "4px 10px", borderRadius: "14px",
            border: `1px solid ${activeLevel === l ? (LEVELS[l]?.color || "#3b82f6") + "60" : "#1e2535"}`,
            cursor: "pointer", fontSize: "10px",
            background: activeLevel === l ? (LEVELS[l]?.bg || "#1e253530") : "transparent",
            color: activeLevel === l ? (LEVELS[l]?.color || "#e8edf5") : "#4a5568",
            fontWeight: activeLevel === l ? 700 : 400,
          }}>{l}</button>
        ))}
        <button onClick={() => setShowBookmarksOnly(p => !p)} style={{
          padding: "4px 10px", borderRadius: "14px",
          border: `1px solid ${showBookmarksOnly ? "#f6a53560" : "#1e2535"}`,
          cursor: "pointer", fontSize: "10px", marginLeft: "auto",
          background: showBookmarksOnly ? "#f6a53518" : "transparent",
          color: showBookmarksOnly ? "#f6a535" : "#4a5568",
          fontWeight: showBookmarksOnly ? 700 : 400,
        }}>⭐ Saved ({bmCount})</button>
      </div>

      {/* DOMAIN TABS */}
      <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "6px", marginBottom: "12px" }}>
        {DOMAINS.map(d => (
          <button key={d.id} onClick={() => { setActiveDomain(d.id); setOpenQ(null); setShowBookmarksOnly(false); }} style={{
            padding: "5px 9px", borderRadius: "16px",
            border: `1px solid ${activeDomain === d.id ? d.color : "#1e2535"}`,
            cursor: "pointer", fontSize: "10px", whiteSpace: "nowrap",
            background: activeDomain === d.id ? `${d.color}15` : "transparent",
            color: activeDomain === d.id ? d.color : "#4a5568",
            fontWeight: activeDomain === d.id ? 700 : 400,
          }}>{d.icon} {d.title}</button>
        ))}
      </div>

      {/* DOMAIN HEADER */}
      {domain && !showBookmarksOnly && (
        <div style={{ background: `${domain.color}0d`, border: `1px solid ${domain.color}25`, borderLeft: `3px solid ${domain.color}`, borderRadius: "10px", padding: "10px 12px", marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#e8edf5" }}>{domain.icon} {domain.title}</span>
              <div style={{ fontSize: "10px", color: "#4a5568", marginTop: "2px" }}>
                {filtered.length} of {domain.qa.length} shown {search && `· matching "${search}"`}
              </div>
            </div>
            <div style={{ display: "flex", gap: "3px" }}>
              {Object.entries(LEVELS).map(([lvl, cfg]) => (
                <div key={lvl} style={{ padding: "2px 6px", borderRadius: "8px", background: `${cfg.color}18`, color: cfg.color, fontSize: "9px", fontWeight: 700 }}>
                  {cfg.short}{levelCounts[lvl] || 0}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOOKMARKS HEADER */}
      {showBookmarksOnly && (
        <div style={{ background: "#f6a53508", border: "1px solid #f6a53525", borderLeft: "3px solid #f6a535", borderRadius: "10px", padding: "10px 12px", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#e8edf5" }}>⭐ Saved Questions ({bmCount})</span>
          <div style={{ fontSize: "10px", color: "#4a5568", marginTop: "2px" }}>Quick review mode</div>
        </div>
      )}

      {/* Q&A LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
        {(showBookmarksOnly ? allBookmarked : filtered).map((item, i) => {
          const idx = showBookmarksOnly ? i : domain.qa.indexOf(item);
          const key = showBookmarksOnly ? item.key : `${activeDomain}-${idx}`;
          const isOpen = openQ === key;
          const lvl = LEVELS[item.level];
          const isBookmarked = bookmarks[key];
          const currentDomain = showBookmarksOnly ? DOMAINS.find(d => d.id === item.domainId) : domain;

          return (
            <div key={key} style={{
              background: "#0e1117",
              border: `1px solid ${isOpen ? (currentDomain?.color || "#3b82f6") + "50" : "#1e2535"}`,
              borderRadius: "11px", overflow: "hidden", transition: "border-color 0.15s"
            }}>
              <div onClick={() => setOpenQ(isOpen ? null : key)} style={{ padding: "11px 13px", cursor: "pointer" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "5px", background: lvl.bg, color: lvl.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", fontWeight: 800, flexShrink: 0, marginTop: "1px" }}>
                    {lvl.short}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8edf5", lineHeight: 1.5 }}>{item.q}</div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "3px", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "9px", color: "#4a5568" }}>{item.level}</span>
                      {showBookmarksOnly && currentDomain && (
                        <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "8px", background: `${currentDomain.color}18`, color: currentDomain.color }}>
                          {currentDomain.icon} {currentDomain.title}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "5px", alignItems: "center", flexShrink: 0 }}>
                    <button onClick={(e) => toggleBookmark(key, e)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", padding: "0", opacity: isBookmarked ? 1 : 0.2, transition: "opacity 0.15s" }}>⭐</button>
                    <span style={{ color: "#4a5568", fontSize: "11px" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>
              </div>
              {isOpen && (
                <div style={{ borderTop: "1px solid #1e2535", padding: "13px" }}>
                  <div style={{ fontSize: "9px", color: currentDomain?.color || "#3b82f6", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "9px" }}>Answer</div>
                  <div style={{ fontSize: "12px", color: "#c8d0de", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>{item.a}</div>
                </div>
              )}
            </div>
          );
        })}

        {!showBookmarksOnly && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#4a5568" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🔍</div>
            <div style={{ fontSize: "12px" }}>No questions match your filter</div>
            {search && <button onClick={() => setSearch("")} style={{ marginTop: "8px", background: "none", border: "1px solid #1e2535", borderRadius: "8px", padding: "4px 12px", color: "#4a5568", cursor: "pointer", fontSize: "11px" }}>Clear search</button>}
          </div>
        )}

        {showBookmarksOnly && allBookmarked.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#4a5568" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>⭐</div>
            <div style={{ fontSize: "12px" }}>No bookmarks yet — tap ⭐ on any question</div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: "20px", textAlign: "center", fontSize: "10px", color: "#1e2535", borderTop: "1px solid #1e2535", paddingTop: "12px", lineHeight: 1.8 }}>
        KP · Senior Engineer · Corporate Banking · Hyderabad<br/>
        {totalQ} Questions · {DOMAINS.length} Domains · Basic → Expert
      </div>
    </div>
  );
}
