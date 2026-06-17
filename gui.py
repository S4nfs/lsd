import tkinter as tk
from tkinter import messagebox
from core import CalculatorCore

class CalculatorGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Modern Python Calculator")
        self.root.geometry("380x520")
        self.root.minsize(320, 420)
        self.root.configure(bg="#1c1c1c")

        self.core = CalculatorCore()
        self.show_sci = False
        self.show_hist = False

        # Configure styles
        self.colors = {
            "bg": "#1c1c1c",
            "screen_bg": "#2d2d2d",
            "text_main": "#ffffff",
            "text_muted": "#aaaaaa",
            "btn_num": "#333333",
            "btn_op": "#3a3a3a",
            "btn_sci": "#2e2e2e",
            "btn_accent": "#0078d4",
            "btn_clear": "#ff4d4d"
        }

        self.create_widgets()
        self.bind_keys()

    def create_widgets(self):
        # Configure grid expansion weights
        self.root.rowconfigure(1, weight=1)
        self.root.columnconfigure(0, weight=1)

        # 1. Screen / Display Frame
        self.screen_frame = tk.Frame(self.root, bg=self.colors["screen_bg"], bd=0, highlightthickness=1, highlightbackground="#3a3a3a")
        self.screen_frame.grid(row=0, column=0, columnspan=2, sticky="nsew", padx=10, pady=10)

        # Configure screen expansion
        self.screen_frame.columnconfigure(0, weight=1)

        # Smaller formula/expression bar
        self.formula_label = tk.Label(
            self.screen_frame,
            text="",
            anchor="e",
            font=("Consolas", 12),
            bg=self.colors["screen_bg"],
            fg=self.colors["text_muted"]
        )
        self.formula_label.grid(row=0, column=0, sticky="ew", padx=15, pady=(10, 2))

        # Main display bar
        self.display_label = tk.Label(
            self.screen_frame,
            text="0",
            anchor="e",
            font=("Consolas", 28, "bold"),
            bg=self.colors["screen_bg"],
            fg=self.colors["text_main"]
        )
        self.display_label.grid(row=1, column=0, sticky="ew", padx=15, pady=(2, 10))

        # 2. Main Layout Container (Holds Sci Panel, Main Grid, History Panel side-by-side)
        self.main_container = tk.Frame(self.root, bg=self.colors["bg"])
        self.main_container.grid(row=1, column=0, sticky="nsew", padx=5, pady=5)
        self.main_container.columnconfigure(1, weight=3) # Main keypad
        self.main_container.rowconfigure(0, weight=1)

        # 3. Scientific Keypad Frame (Initially hidden)
        self.sci_frame = tk.Frame(self.main_container, bg=self.colors["bg"])
        # Grid placement is handled dynamically in toggle_scientific()

        # 4. Standard Keypad Frame
        self.std_frame = tk.Frame(self.main_container, bg=self.colors["bg"])
        self.std_frame.grid(row=0, column=1, sticky="nsew")
        self.setup_standard_grid()

        # 5. History Panel Frame (Initially hidden)
        self.hist_frame = tk.Frame(self.main_container, bg=self.colors["screen_bg"], width=180)
        self.setup_history_panel()

        # 6. Bottom Status/Bar containing toggles
        self.bottom_bar = tk.Frame(self.root, bg=self.colors["bg"])
        self.bottom_bar.grid(row=2, column=0, sticky="ew", padx=10, pady=(0, 10))

        self.sci_toggle_btn = tk.Button(
            self.bottom_bar, text="Scientific", font=("Helvetica", 9),
            bg=self.colors["btn_op"], fg=self.colors["text_main"],
            activebackground=self.colors["btn_accent"], activeforeground="#ffffff",
            bd=0, padx=8, pady=4, cursor="hand2", command=self.toggle_scientific
        )
        self.sci_toggle_btn.pack(side="left")

        self.hist_toggle_btn = tk.Button(
            self.bottom_bar, text="History", font=("Helvetica", 9),
            bg=self.colors["btn_op"], fg=self.colors["text_main"],
            activebackground=self.colors["btn_accent"], activeforeground="#ffffff",
            bd=0, padx=8, pady=4, cursor="hand2", command=self.toggle_history
        )
        self.hist_toggle_btn.pack(side="right")

    def setup_standard_grid(self):
        # Grid size: 5 rows x 4 columns
        for r in range(5):
            self.std_frame.rowconfigure(r, weight=1)
        for c in range(4):
            self.std_frame.columnconfigure(c, weight=1)

        # Standard buttons: (label, row, col, style_key)
        buttons = [
            ("C", 0, 0, "btn_clear"), ("(", 0, 1, "btn_op"), (")", 0, 2, "btn_op"), ("÷", 0, 3, "btn_op"),
            ("7", 1, 0, "btn_num"),   ("8", 1, 1, "btn_num"),("9", 1, 2, "btn_num"),("×", 1, 3, "btn_op"),
            ("4", 2, 0, "btn_num"),   ("5", 2, 1, "btn_num"),("6", 2, 2, "btn_num"),("-", 2, 3, "btn_op"),
            ("1", 3, 0, "btn_num"),   ("2", 3, 1, "btn_num"),("3", 3, 2, "btn_num"),("+", 3, 3, "btn_op"),
            ("⌫", 4, 0, "btn_op"),   ("0", 4, 1, "btn_num"),(".", 4, 2, "btn_num"),("=", 4, 3, "btn_accent")
        ]

        for text, r, c, style in buttons:
            cmd = lambda t=text: self.on_button_click(t)
            btn = tk.Button(
                self.std_frame, text=text, font=("Consolas", 14, "bold"),
                bg=self.colors.get(style, self.colors["btn_num"]),
                fg=self.colors["text_main"],
                activebackground=self.colors["btn_accent"],
                activeforeground="#ffffff",
                bd=0, cursor="hand2", command=cmd
            )
            btn.grid(row=r, column=c, sticky="nsew", padx=3, pady=3)

    def setup_scientific_grid(self):
        # 5 rows x 2 columns for scientific functions
        for r in range(5):
            self.sci_frame.rowconfigure(r, weight=1)
        for c in range(2):
            self.sci_frame.columnconfigure(c, weight=1)

        sci_buttons = [
            ("√", 0, 0), ("^", 0, 1),
            ("sin", 1, 0), ("cos", 1, 1),
            ("tan", 2, 0), ("ln", 2, 1),
            ("log", 3, 0), ("%", 3, 1),
            ("π", 4, 0), ("e", 4, 1)
        ]

        for text, r, c in sci_buttons:
            cmd = lambda t=text: self.on_button_click(t)
            btn = tk.Button(
                self.sci_frame, text=text, font=("Consolas", 12, "bold"),
                bg=self.colors["btn_sci"], fg=self.colors["text_main"],
                activebackground=self.colors["btn_accent"], activeforeground="#ffffff",
                bd=0, cursor="hand2", command=cmd
            )
            btn.grid(row=r, column=c, sticky="nsew", padx=3, pady=3)

    def setup_history_panel(self):
        self.hist_frame.columnconfigure(0, weight=1)
        self.hist_frame.rowconfigure(1, weight=1)

        header = tk.Label(self.hist_frame, text="History", font=("Helvetica", 11, "bold"), bg=self.colors["screen_bg"], fg=self.colors["text_main"])
        header.grid(row=0, column=0, sticky="ew", padx=5, pady=5)

        self.hist_listbox = tk.Listbox(
            self.hist_frame, bg=self.colors["screen_bg"], fg=self.colors["text_main"],
            font=("Consolas", 10), bd=0, highlightthickness=0, selectbackground=self.colors["btn_accent"]
        )
        self.hist_listbox.grid(row=1, column=0, sticky="nsew", padx=5, pady=5)
        self.hist_listbox.bind("<<ListboxSelect>>", self.on_history_select)

        clear_hist_btn = tk.Button(
            self.hist_frame, text="Clear History", font=("Helvetica", 9),
            bg=self.colors["btn_num"], fg=self.colors["text_muted"],
            activebackground=self.colors["btn_clear"], activeforeground="#ffffff",
            bd=0, cursor="hand2", command=self.clear_history_data
        )
        clear_hist_btn.grid(row=2, column=0, sticky="ew", padx=5, pady=5)

    def toggle_scientific(self):
        self.show_sci = not self.show_sci
        if self.show_sci:
            self.root.geometry("520x520" if not self.show_hist else "700x520")
            self.main_container.columnconfigure(0, weight=2) # Scientific panel weight
            self.sci_frame.grid(row=0, column=0, sticky="nsew", padx=(0, 5))
            self.setup_scientific_grid()
            self.sci_toggle_btn.configure(bg=self.colors["btn_accent"])
        else:
            self.sci_frame.grid_forget()
            self.main_container.columnconfigure(0, weight=0)
            self.sci_toggle_btn.configure(bg=self.colors["btn_op"])
            self.root.geometry("380x520" if not self.show_hist else "560x520")

    def toggle_history(self):
        self.show_hist = not self.show_hist
        if self.show_hist:
            width = 560 if not self.show_sci else 700
            self.root.geometry(f"{width}x520")
            self.main_container.columnconfigure(2, weight=2)
            self.hist_frame.grid(row=0, column=2, sticky="nsew", padx=(5, 0))
            self.update_history_display()
            self.hist_toggle_btn.configure(bg=self.colors["btn_accent"])
        else:
            self.hist_frame.grid_forget()
            self.main_container.columnconfigure(2, weight=0)
            self.hist_toggle_btn.configure(bg=self.colors["btn_op"])
            width = 380 if not self.show_sci else 520
            self.root.geometry(f"{width}x520")

    def on_button_click(self, char: str):
        if char == "C":
            self.core.clear()
            self.formula_label.configure(text="")
        elif char == "⌫":
            self.core.backspace()
        elif char == "=":
            formula = self.core.get_expression()
            if not formula.strip():
                return
            self.formula_label.configure(text=f"{formula} =")
            result = self.core.evaluate()
            self.update_history_display()
        elif char in ["sin", "cos", "tan", "log", "ln", "√"]:
            self.core.append(f"{char}(")
        else:
            self.core.append(char)

        # Update Display
        expr = self.core.get_expression()
        self.display_label.configure(text=expr if expr else "0")

    def update_history_display(self):
        if not self.show_hist:
            return
        self.hist_listbox.delete(0, tk.END)
        for idx, item in enumerate(self.core.get_history()):
            # Show "expr = result"
            self.hist_listbox.insert(tk.END, f"{item['expression']} = {item['result']}")

    def on_history_select(self, event):
        selection = self.hist_listbox.curselection()
        if selection:
            idx = selection[0]
            history_item = self.core.get_history()[idx]
            # Load result into active expression
            self.core.set_expression(history_item["result"])
            self.formula_label.configure(text=f"Loaded: {history_item['expression']}")
            self.display_label.configure(text=history_item["result"])

    def clear_history_data(self):
        self.core.clear_history()
        self.update_history_display()

    def bind_keys(self):
        self.root.bind("<Key>", self.on_key_press)

    def on_key_press(self, event):
        key = event.char
        keysym = event.keysym

        # Match physical key bindings
        if key in "0123456789.()+-/*%":
            # Translate standard keyboard characters to visual representation if needed
            char = key
            if char == "*": char = "×"
            if char == "/": char = "÷"
            self.on_button_click(char)
        elif keysym == "Return" or key == "=":
            self.on_button_click("=")
        elif keysym == "BackSpace":
            self.on_button_click("⌫")
        elif keysym == "Escape" or key.lower() == "c":
            self.on_button_click("C")
        elif key == "^":
            self.on_button_click("^")
