import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  // Command 1: Convert file from explorer context menu
  const convertFile = vscode.commands.registerCommand(
    "tomdnow.convertFile",
    async (uri: vscode.Uri) => {
      if (!uri) {
        vscode.window.showErrorMessage("No file selected");
        return;
      }
      await convertToMarkdown(uri.fsPath);
    }
  );

  // Command 2: Convert currently open file
  const convertCurrentFile = vscode.commands.registerCommand(
    "tomdnow.convertCurrentFile",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No file is currently open");
        return;
      }
      await convertToMarkdown(editor.document.uri.fsPath);
    }
  );

  context.subscriptions.push(convertFile, convertCurrentFile);
}

async function convertToMarkdown(filePath: string) {
  const config = vscode.workspace.getConfiguration("tomdnow");
  const apiKey = config.get<string>("apiKey");
  const apiUrl =
    config.get<string>("apiUrl") || "https://tomdnow.com/api/v1";

  if (!apiKey) {
    const action = await vscode.window.showErrorMessage(
      "tomdnow API key not configured. Get one at tomdnow.com/dashboard",
      "Open Settings",
      "Get API Key"
    );
    if (action === "Open Settings") {
      vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "tomdnow.apiKey"
      );
    } else if (action === "Get API Key") {
      vscode.env.openExternal(
        vscode.Uri.parse("https://tomdnow.com/dashboard")
      );
    }
    return;
  }

  const fileName = path.basename(filePath);

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `Converting ${fileName} to Markdown...`,
      cancellable: false,
    },
    async () => {
      try {
        const fileContent = fs.readFileSync(filePath);
        const formData = new FormData();
        formData.append("file", new Blob([fileContent]), fileName);

        const response = await fetch(`${apiUrl}/convert`, {
          method: "POST",
          headers: { "X-Api-Key": apiKey },
          body: formData,
        });

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          throw new Error(
            error.error || error.detail || `HTTP ${response.status}`
          );
        }

        const result = (await response.json()) as { markdown?: string };
        const markdown = result.markdown;

        if (!markdown) {
          throw new Error("No markdown content in response");
        }

        // Save as .md file next to the original
        const mdPath = filePath.replace(/\.[^.]+$/, ".md");
        fs.writeFileSync(mdPath, markdown, "utf-8");

        // Open the converted file
        const doc = await vscode.workspace.openTextDocument(mdPath);
        await vscode.window.showTextDocument(doc);

        vscode.window.showInformationMessage(
          `Converted ${fileName} -> ${path.basename(mdPath)}`
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Conversion failed";
        vscode.window.showErrorMessage(`tomdnow: ${message}`);
      }
    }
  );
}

export function deactivate() {}
