import sys
from core import CalculatorCore

def show_menu():
    print("\n" + "="*30)
    print("      PYTHON CLI CALCULATOR")
    print("="*30)
    print("1. Enter Expression (e.g., 12 + 5 * (2^3))")
    print("2. Basic Arithmetic (+, -, *, /)")
    print("3. Scientific Operations (sin, cos, tan, log, ln, sqrt)")
    print("4. View History")
    print("5. Clear History")
    print("6. Help / Instructions")
    print("7. Exit")
    print("="*30)

def run_cli():
    core = CalculatorCore()
    print("Welcome to the Python Calculator CLI!")

    while True:
        show_menu()
        try:
            choice = input("Enter choice (1-7): ").strip()

            if choice == "1":
                expr = input("Enter mathematical expression (use ^ for power, √ for sqrt): ").strip()
                if expr:
                    core.set_expression(expr)
                    print(f"Evaluating: {expr}")
                    result = core.evaluate()
                    print(f"Result: {result}")

            elif choice == "2":
                print("\n--- Basic Arithmetic ---")
                try:
                    num1 = float(input("Enter first number: "))
                    op = input("Enter operator (+, -, *, /): ").strip()
                    num2 = float(input("Enter second number: "))

                    if op not in ["+", "-", "*", "/"]:
                        print("Error: Invalid operator.")
                        continue

                    expr = f"{num1} {op} {num2}"
                    core.set_expression(expr)
                    result = core.evaluate()
                    print(f"Result: {expr} = {result}")
                except ValueError:
                    print("Error: Invalid number format.")

            elif choice == "3":
                print("\n--- Scientific Operations ---")
                print("Options: sin(deg), cos(deg), tan(deg), log(base10), ln(natural), sqrt")
                op = input("Choose operation: ").strip().lower()

                if op not in ["sin", "cos", "tan", "log", "ln", "sqrt"]:
                    print("Error: Invalid scientific operation.")
                    continue

                try:
                    val = float(input("Enter value: "))
                    expr = f"{op}({val})"
                    core.set_expression(expr)
                    result = core.evaluate()
                    print(f"Result: {expr} = {result}")
                except ValueError:
                    print("Error: Invalid number format.")

            elif choice == "4":
                print("\n--- Calculation History ---")
                history = core.get_history()
                if not history:
                    print("No calculations in history yet.")
                else:
                    for idx, item in enumerate(history, 1):
                        print(f"{idx}. {item['expression']} = {item['result']}")

            elif choice == "5":
                core.clear_history()
                print("History cleared successfully.")

            elif choice == "6":
                print("\n--- HELP & INSTRUCTIONS ---")
                print("This calculator supports full mathematical expressions:")
                print("  - Use standard operations: +, -, *, /")
                print("  - Use '^' for power (e.g. '2^3' evaluates to 8)")
                print("  - Use '√' or 'sqrt' for square root (e.g. '√16' or 'sqrt(16)' evaluates to 4)")
                print("  - Trigonometry (sin, cos, tan) expects angles in DEGREES.")
                print("  - Implicit multiplication is supported, like '2(3)' or '2pi'")
                print("  - You can enter variables 'pi' and 'e' in expressions")

            elif choice == "7":
                print("Thank you for using Python CLI Calculator. Goodbye!")
                break

            else:
                print("Error: Invalid choice. Please enter a number between 1 and 7.")

        except (KeyboardInterrupt, EOFError):
            print("\nExiting. Goodbye!")
            break
        except Exception as e:
            print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    run_cli()
