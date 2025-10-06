#!/usr/bin/env python3

# Only use stdlib to avoid needing to install dependencies
import ast
import sys
import urllib.request
import os

def find_env_vars(code, filename):
    tree = ast.parse(code)
    env_vars_found = {}  # Dictionary to store env vars, filenames, defaults, and types

    class EnvVarVisitor(ast.NodeVisitor):
        def __init__(self):
            self.current_env_vars = {}  # Store env vars with potential defaults and types

        def visit_Subscript(self, node):
            if isinstance(node.value, ast.Attribute):
                if (
                    isinstance(node.value.value, ast.Name)
                    and node.value.value.id == "os"
                    and node.value.attr == "environ"
                ):
                    if isinstance(node.slice, ast.Constant):
                        env_var_name = node.slice.value
                        if env_var_name not in self.current_env_vars:
                            self.current_env_vars[env_var_name] = {"default": None, "type": "str"} # Default type str for os.environ
                    elif isinstance(node.slice, ast.BinOp):
                        # Handle dynamically constructed env var names like os.environ["VAR_" + "NAME"]
                        env_var_name = ast.unparse(node.slice)
                        if env_var_name not in self.current_env_vars:
                            self.current_env_vars[env_var_name] = {"default": None, "type": "str"} # Default type str for os.environ
            self.generic_visit(node)

        def visit_Call(self, node):
            if isinstance(node.func, ast.Attribute):
                # Check for os.getenv("VAR_NAME", "default_value")
                if (
                    isinstance(node.func.value, ast.Name)
                    and node.func.value.id == "os"
                    and node.func.attr == "getenv"
                ):
                    if node.args and isinstance(node.args[0], ast.Constant):
                        env_var_name = node.args[0].value
                        default_value = None
                        var_type = "str" # Default type str for os.getenv
                        if len(node.args) > 1:
                            default_node = node.args[1]
                            if isinstance(default_node, ast.Constant):
                                default_value = default_node.value
                                var_type = "str" # Still str if default is constant string
                            elif isinstance(default_node, ast.Name) and default_node.id == 'None': # Check for None literal
                                default_value = None
                                var_type = "str" # Still str even if default is None in getenv
                            else:  # Capture other default expressions as unparsed code
                                default_value = ast.unparse(default_node)
                                var_type = "str" # Assume str if complex default in getenv
                        if env_var_name not in self.current_env_vars:
                            self.current_env_vars[env_var_name] = {"default": default_value, "type": var_type}

                # Check for os.environ.get("VAR_NAME", "default_value")
                elif (
                    isinstance(node.func.value, ast.Attribute)
                    and isinstance(node.func.value.value, ast.Name)
                    and node.func.value.value.id == "os"
                    and node.func.value.attr == "environ"
                    and node.func.attr == "get"
                ):
                    if node.args and isinstance(node.args[0], ast.Constant):
                        env_var_name = node.args[0].value
                        default_value = None
                        var_type = "str" # Default type str for os.environ.get
                        if len(node.args) > 1:
                            default_node = node.args[1]
                            if isinstance(default_node, ast.Constant):
                                default_value = default_node.value
                                var_type = "str" # Still str if default is constant string
                            elif isinstance(default_node, ast.Name) and default_node.id == 'None': # Check for None literal
                                default_value = None
                                var_type = "str" # Still str even if default is None in get
                            else:  # Capture other default expressions as unparsed code
                                default_value = ast.unparse(default_node)
                                var_type = "str" # Assume str if complex default in get
                        if env_var_name not in self.current_env_vars:
                            self.current_env_vars[env_var_name] = {"default": default_value, "type": var_type}

            elif isinstance(node.func, ast.Name) and node.func.id == "PersistentConfig":
                if node.args and isinstance(node.args[0], ast.Constant):
                    env_var_name = node.args[0].value
                    default_value = None
                    var_type = "str" # Assume str as base type for PersistentConfig, will refine
                    if len(node.args) > 2:  # Default value is the third argument
                        default_node = node.args[2]
                        if isinstance(default_node, ast.Constant):
                            default_value = default_node.value
                            if isinstance(default_value, bool):
                                var_type = "bool"
                            elif isinstance(default_value, int):
                                var_type = "int"
                            elif isinstance(default_value, float):
                                var_type = "float"
                            else:
                                var_type = "str" # String constant
                        elif isinstance(default_node, ast.List):
                            default_value = ast.unparse(default_node)
                            var_type = "list[dict]" # Assuming list of dicts for DEFAULT_PROMPT_SUGGESTIONS case, refine if needed
                        elif isinstance(default_node, ast.Dict):
                            default_value = ast.unparse(default_node)
                            var_type = "dict"
                        elif isinstance(default_node, ast.Tuple):
                            default_value = ast.unparse(default_node)
                            var_type = "tuple"
                        elif isinstance(default_node, ast.Set):
                            default_value = ast.unparse(default_node)
                            var_type = "set"
                        elif isinstance(default_node, ast.Name):  # Capture variable name as default
                            default_value = default_node.id
                            var_type = "str" # Assume str if variable default
                        elif isinstance(default_node, ast.Call):  # Check if default_node is a Call (function call)
                            if isinstance(default_node.func, ast.Name) and default_node.func.id == "int":
                                var_type = "int"
                            elif isinstance(default_node.func, ast.Name) and default_node.func.id == "float":
                                var_type = "float"
                            elif isinstance(default_node.func, ast.Name) and default_node.func.id == "bool":
                                var_type = "bool"
                            elif isinstance(default_node.func, ast.Name) and default_node.func.id == "str":
                                var_type = "str"
                            elif isinstance(default_node.func, ast.Attribute) and default_node.func.attr == 'getenv' and isinstance(default_node.func.value, ast.Name) and default_node.func.value.id == 'os':
                                if len(default_node.args) > 1 and isinstance(default_node.args[1], ast.Constant):
                                    default_value = default_node.args[1].value  # Extract default from os.getenv within PersistentConfig
                                    var_type = "str" # Still string from getenv
                                elif len(default_node.args) == 1:
                                    default_value = None  # No default in os.getenv
                                    var_type = "str" # Still string from getenv
                            elif isinstance(default_node.func, ast.Attribute) and default_node.func.attr == 'get' and isinstance(default_node.func.value, ast.Attribute) and default_node.func.value.attr == 'environ' and isinstance(default_node.func.value.value, ast.Name) and default_node.func.value.value.id == 'os':
                                if len(default_node.args) > 1 and isinstance(default_node.args[1], ast.Constant):
                                    default_value = default_node.args[1].value  # Extract default from os.environ.get within PersistentConfig
                                    var_type = "str" # Still string from getenv
                                elif len(default_node.args) == 1:
                                    default_value = None  # No default in os.environ.get
                                    var_type = "str" # Still string from getenv
                            else:  # Capture other function calls as unparsed code
                                default_value = ast.unparse(default_node)
                                var_type = "str" # Assume str for complex call
                        elif isinstance(default_node, ast.Compare):  # Handle boolean expressions like 'os.getenv(...) == "true"'
                            default_value = ast.unparse(default_node)  # Capture the whole boolean expression as unparsed code
                            var_type = "bool" # Likely boolean from comparison

                        elif isinstance(default_node, ast.Name) and default_node.id == 'None':  # Check for None literal in PersistentConfig
                            default_value = None
                            var_type = "str" # Could be anything, but let's say str as base

                        elif default_node:  # Capture any other default expressions as unparsed code
                            default_value = ast.unparse(default_node)
                            var_type = "str" # Assume str for other expressions

                    if env_var_name not in self.current_env_vars:
                        self.current_env_vars[env_var_name] = {"default": default_value, "type": var_type}

            self.generic_visit(node)

        def finalize_env_vars(self, filename, env_vars_found):
            for env_var, context in self.current_env_vars.items(): # context is now a dict with default and type
                if env_var not in env_vars_found:
                    env_vars_found[env_var] = {"files": set(), "default": None, "type": "str"} # Initialize type as str if not found before
                env_vars_found[env_var]["files"].add(filename)
                if env_vars_found[env_var]["default"] is None:  # Only set default if not already set
                    env_vars_found[env_var]["default"] = context["default"]
                if env_vars_found[env_var]["type"] == "str": # Only set type if still default str, otherwise keep more specific type
                     env_vars_found[env_var]["type"] = context["type"]

    visitor = EnvVarVisitor()
    visitor.visit(tree)
    visitor.finalize_env_vars(filename, env_vars_found)  # Pass filename to finalize
    return env_vars_found

def main():
    if len(sys.argv) < 2:
        print("Usage: scan-missing-env-vars.py <git_ref>")
        print("Example: scan-missing-env-vars.py main")
        sys.exit(0)

    git_ref = sys.argv[1]
    print(f"Scanning git ref: {git_ref}")

    urls = [
        f"https://raw.githubusercontent.com/open-webui/open-webui/{git_ref}/backend/open_webui/config.py",
        f"https://raw.githubusercontent.com/open-webui/open-webui/{git_ref}/backend/open_webui/env.py",
        f"https://raw.githubusercontent.com/open-webui/open-webui/{git_ref}/backend/open_webui/migrations/env.py",
    ]
    filenames = ["config.py", "env.py", "migrations/env.py"]

    all_env_vars_with_context = {}  # Changed to dictionary to store context

    try:
        for url, filename in zip(urls, filenames):
            with urllib.request.urlopen(url) as response:
                contents = response.read().decode("utf-8")

            file_env_vars = find_env_vars(contents, filename)  # Pass filename here
            for env_var, context in file_env_vars.items():  # context is now a dict
                if env_var not in all_env_vars_with_context:
                    all_env_vars_with_context[env_var] = {"files": set(), "default": None, "type": "str"} # Initialize type as str
                all_env_vars_with_context[env_var]["files"].update(context["files"])  # Merge file sets
                if all_env_vars_with_context[env_var]["default"] is None:  # Only set default if not already set
                    all_env_vars_with_context[env_var]["default"] = context["default"]
                if all_env_vars_with_context[env_var]["type"] == "str": # Only update type if still default str, keep more specific type
                    all_env_vars_with_context[env_var]["type"] = context["type"]

    except urllib.error.URLError as e:
        print(f"Failed to open URL: {e}")
        sys.exit(1)

    ignored_env_vars = {
        "FROM_INIT_PY",
        "GLOBAL_LOG_LEVEL",
        "http_proxy",
        "https_proxy",
        "no_proxy",
        "PORT",
        "WEBUI_JWT_SECRET_KEY",
    }

    documented_env_vars = set()
    script_dir = os.path.dirname(os.path.abspath(__file__))
    docs_file = os.path.join(
        script_dir, *[part for part in ["..", "docs", "getting-started", "env-configuration.md"]]
    )

    try:
        with open(docs_file, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                if line.startswith("#### `"):
                    env_var = line.split("`")[1]
                    documented_env_vars.add(env_var)
    except FileNotFoundError as e:
        print(f"Failed to open file: {e}")
        sys.exit(1)

    print("\nEnvironment variables accessed but not documented:")
    not_documented_env_vars_with_context = {
        env_var: context
        for env_var, context in all_env_vars_with_context.items()
        if env_var not in documented_env_vars and env_var not in ignored_env_vars
    }

    persistent_config_vars = {}
    other_undocumented_vars = {}

    for env_var, context in not_documented_env_vars_with_context.items():
        if "config.py" in context["files"]:  # Check if 'config.py' is in the set of files
            persistent_config_vars[env_var] = context
        else:
            other_undocumented_vars[env_var] = context

    def format_default_output(default, var_type):
        if default is None:
            return "(default: None)"
        elif var_type == "list[dict]" or var_type == "dict" or var_type == "tuple" or var_type == "set":
            return f"(default: {default}, type: {var_type})" # Show full default for complex types
        else:
            return f"(default: '{default}', type: {var_type})" # Quote string defaults

    if persistent_config_vars:
        print("\n  PersistentConfig environment variables (accessed in config.py):")
        for env_var in sorted(persistent_config_vars.keys()):
            default_str = format_default_output(persistent_config_vars[env_var]['default'], persistent_config_vars[env_var]['type'])
            print(f"    - {env_var} {default_str}")

    if other_undocumented_vars:
        print("\n  Other undocumented environment variables:")
        for env_var in sorted(other_undocumented_vars.keys()):
            default_str = format_default_output(other_undocumented_vars[env_var]['default'], other_undocumented_vars[env_var]['type'])
            print(
                f"    - {env_var} {default_str} (in files: {', '.join(sorted(other_undocumented_vars[env_var]['files']))})"
            )  # Show files and defaults and types

    if not persistent_config_vars and not other_undocumented_vars:
        print("  None")

    print("\nEnvironment variables documented but not accessed:")
    diff = documented_env_vars - set(all_env_vars_with_context.keys()) - ignored_env_vars  # Use keys of the dict
    for env_var in sorted(diff):
        print(env_var)
    if not diff:
        print("None")

if __name__ == "__main__":
    main()
