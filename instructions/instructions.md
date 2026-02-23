Rule: append todos mentioned in chat to the end of the todo list without acting on them
Reason: To capture todos without disrupting current work

Rule: do not start working on newly added todos immediately
Reason: To avoid interrupting the current task in progress

Rule: continue with whatever task is currently in progress when a new todo is added
Reason: To maintain focus on the current task

Rule: work through todos in list order
Reason: To ensure todos are completed sequentially

Rule: complete the current todo before beginning the next one
Reason: To ensure each todo is fully completed before moving on

Rule: may use a single options object instead of positional arguments when a function requires more than three parameters
Reason: To improve readability and maintainability of function signatures

Rule: define the type as a named type alias directly above the function definition when using an options object for function parameters
Reason: To provide clear type documentation co-located with the function

Rule: prioritize small utility functions wherever necessary in the codebase
Reason: To promote modularity and reusability

Rule: use callbacks or dependency injection if side effects are required
Reason: To manage side effects cleanly while maintaining testability

Rule: do not use complex types wherever possible
Reason: To keep type definitions simple and readable

Rule: do not use non-null assertions
Reason: To verify values before accessing them using narrowing type guards instead

Rule: do not use excessive optional chaining
Reason: To ensure deliberate null/undefined checks using explicit guards and conditions so access patterns are clear and intentional

Rule: do not use em dashes in general
Reason: To maintain consistent, simple punctuation across all written content

Rule: use consistent whitespace for readability
Reason: Whitespace is critical for readability and inconsistent spacing makes code harder to scan

Rule: prefer early returns over if-else statements
Reason: To reduce nesting and improve readability by handling edge cases first

Rule: do not use ternaries, especially chained ternaries, unless used for simple const or object assignment
Reason: To keep conditional logic readable and explicit

Rule: do not split function parameters across multiple lines
Reason: To keep function signatures compact and scannable on a single line

Rule: split onto multiple lines object literals or functions with three or more fields or parameters
Reason: One or two fields on a single line is fine, but three or more becomes hard to scan and should be expanded for readability

Rule: use an array with join instead of string concatenation with plus signs when exceeding 120 characters
Reason: To allow multi-line formatting that the formatter will not collapse back into a single line

Rule: complete the easiest tasks first when working through a todo list
Reason: To build momentum and reduce list size quickly before tackling complex items

Rule: do not delegate work to subagents or use the explore/task tool
Reason: To keep all context visible and avoid losing information to subagent boundaries

Rule: do not use the void operator for discarding promise return values
Reason: Fire-and-forget async calls work fine without it

Rule: wrap multi-line implicit arrow function returns in parentheses
Reason: To clarify that the multi-line expression is an implicit return and improve readability

Rule: insert a blank line before the next statement when a closing brace or parenthesis ends a statement
Reason: To visually separate statement blocks and improve readability

Rule: do not insert a blank line between a const/let declaration and its immediately following guard if-check
Reason: The declaration and its guard check are logically coupled and should be visually grouped by touching

Rule: use discriminated unions with a shared literal field instead of a single type with optional properties when modeling outcomes with distinct states
Reason: Prevents invalid states and enables exhaustive narrowing

Rule: use BDD style with it() instead of test() when writing or modifying test files
Reason: To maintain consistent test style across the codebase

Rule: do not use the this keyword when it can be avoided
Reason: To prefer functional approaches that do not rely on this binding

Rule: do not use classes when functional alternatives exist
Reason: To prefer functional composition over class hierarchies

Rule: read the file first when a file operation fails because the file has not been read yet
Reason: To resolve the root cause before retrying

Rule: do not retry the same failing operation multiple times without addressing the underlying cause
Reason: Repeating an identical failing action wastes effort when the root issue has not changed

Rule: use an early return with undefined instead of wrapping the function body in an if block when checking if an optional config property exists
Reason: To reduce nesting and keep the happy path at the top level

Rule: do not use prune, distill, or context management tools while actively working on a task
Reason: Complete the current work first and only manage context during natural breaks in chat flow
