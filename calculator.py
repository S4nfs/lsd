import sys
import argparse

def main():
    parser = argparse.ArgumentParser(description="Modern Python Calculator (GUI & CLI modes)")
    parser.add_argument("--cli", action="store_true", help="Launch in command-line interface mode directly")
    args = parser.parse_args()

    if args.cli:
        # User requested CLI explicitly
        from cli import run_cli
        run_cli()
    else:
        try:
            # Try to launch GUI mode
            import tkinter as tk
            from gui import CalculatorGUI

            root = tk.Tk()
            app = CalculatorGUI(root)
            root.mainloop()

        except Exception as e:
            # Fall back to CLI if GUI initialization fails (e.g., headless terminal, missing Tkinter)
            print(f"Warning: Could not launch GUI mode due to: {e}")
            print("Falling back to CLI mode...\n")
            from cli import run_cli
            run_cli()

if __name__ == "__main__":
    main()
