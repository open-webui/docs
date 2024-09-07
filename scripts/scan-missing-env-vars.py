#!/usr/bin/env python3
# Only use stdlib to avoid needing to install dependencies
import ast
import sys
import urllib.request
import os


def find_env_vars(code):
    tree = ast.parse(code)

    class EnvVarVisitor(ast.NodeVisitor):
        def __init__(self):
            self.env_vars = set()

        def visit_Subscript(self, node):
            if isinstance(node.value, ast.Attribute):
                if (
                    isinstance(node.value.value, ast.Name)
                    and node.value.value.id == "os"
                    and node.value.attr == "environ"
                ):
                    if isinstance(node.slice, ast.Constant):
                        self.env_vars.add(node.slice.value)
                    elif isinstance(node.slice, ast.BinOp):
                        # Handle dynamically constructed env var names like os.environ["VAR_" + "NAME"]
                        self.env_vars.add(ast.unparse(node.slice))
            self.generic_visit(node)

        def visit_Call(self, node):
            if isinstance(node.func, ast.Attribute):
                if (
                    isinstance(node.func.value, ast.Name)
                    and node.func.value.id == "os"
                    and node.func.attr in ("getenv", "get")
                ) or (
                    isinstance(node.func.value, ast.Attribute)
                    and isinstance(node.func.value.value, ast.Name)
                    and node.func.value.value.id == "os"
                    and node.func.value.attr == "environ"
                    and node.func.attr == "get"
                ):
                    if isinstance(node.args[0], ast.Constant):
                        self.env_vars.add(node.args[0].value)
            self.generic_visit(node)

    visitor = EnvVarVisitor()
    visitor.visit(tree)
    return visitor.env_vars


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
    ]
    filenames = ["config.py", "env.py"]

    all_env_vars = set()

    for url, filename in zip(urls, filenames):
        with urllib.request.urlopen(url) as response:
            contents = response.read().decode("utf-8")

        for env_var in find_env_vars(contents):
            all_env_vars.add(env_var)

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
        script_dir, "..", "docs", "getting-started", "env-configuration.md"
    )
    with open(docs_file, "r") as f:
        for line in f:
            if line.startswith("#### `"):
                env_var = line.split("`")[1]
                documented_env_vars.add(env_var)

    print("\nEnvironment variables accessed but not documented:")
    if all_env_vars - documented_env_vars:
        for env_var in sorted(all_env_vars - documented_env_vars - ignored_env_vars):
            print(env_var)
    else:
        print("None")

    print("\nEnvironment variables documented but not accessed:")
    diff = documented_env_vars - all_env_vars - ignored_env_vars
    if diff:
        for env_var in sorted(diff):
            print(env_var)
    else:
        print("None")


if __name__ == "__main__":
    main()
