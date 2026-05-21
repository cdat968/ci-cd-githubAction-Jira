// scripts/create-jira-ticket.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Cần thiết khi dùng ES Module để lấy __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc từ environment variables
const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const JIRA_PROJECT = process.env.JIRA_PROJECT || "DEMO";
const COMMIT_SHA = process.env.COMMIT_SHA || "unknown";
const AUTHOR = process.env.AUTHOR || "unknown";
const JIRA_ASSIGNEE_ID = process.env.JIRA_ASSIGNEE_ID || "";

// Đọc file kết quả test
const reportPath = path.join(__dirname, "../reports/jest-results.json");
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

// Lọc các test bị fail
const failedTests = report.testResults
    .flatMap((suite) => suite.assertionResults || [])
    .filter((test) => test.status === "failed");

if (failedTests.length === 0) {
    console.log("Không có test nào fail");
    process.exit(0);
}

console.log(`Tìm thấy ${failedTests.length} test fail → tạo Jira tickets...`);

// Tạo ticket cho 1 test fail
async function createTicket(test) {
    const response = await fetch(`${JIRA_URL}/rest/api/3/issue`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization:
                "Basic " +
                Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString("base64"),
        },
        body: JSON.stringify({
            fields: {
                project: { key: JIRA_PROJECT },
                issuetype: { name: "Bug" },
                summary: `[AUTO] Test fail: ${test.fullName}`,
                // ...(JIRA_ASSIGNEE_ID
                //     ? { assignee: { accountId: JIRA_ASSIGNEE_ID } }
                //     : {}),
                description: {
                    type: "doc",
                    version: 1,
                    content: [
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: `Commit: ${COMMIT_SHA}`,
                                    marks: [{ type: "strong" }],
                                },
                            ],
                        },
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: `Author: ${AUTHOR}`,
                                    marks: [{ type: "strong" }],
                                },
                            ],
                        },
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: `Test failed: ${test.fullName}`,
                                    marks: [{ type: "strong" }],
                                },
                            ],
                        },
                        {
                            type: "paragraph",
                            content: [
                                {
                                    type: "text",
                                    text: "Error:",
                                    marks: [{ type: "strong" }],
                                },
                            ],
                        },
                        {
                            type: "codeBlock",
                            attrs: {
                                language: "text",
                            },
                            content: [
                                {
                                    type: "text",
                                    text:
                                        test.failureMessages.join("\n") ||
                                        "No failure message",
                                },
                            ],
                        },
                    ],
                },
                priority: { name: "High" },
                labels: ["auto-created", "ci-failure"],
            },
        }),
    });

    const data = await response.json();

    if (response.ok) {
        console.log(`✅ Ticket tạo thành công: ${data.key}`);
        await assignIssue(data.key);
    } else {
        console.error(`❌ Lỗi tạo ticket: ${JSON.stringify(data)}`);
    }
}

async function assignIssue(issueKey) {
    if (!JIRA_ASSIGNEE_ID) {
        console.log("Không có JIRA_ASSIGNEE_ID → bỏ qua assign");
        return;
    }

    const response = await fetch(
        `${JIRA_URL}/rest/api/3/issue/${issueKey}/assignee`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Basic " +
                    Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString(
                        "base64",
                    ),
            },
            body: JSON.stringify({
                accountId: JIRA_ASSIGNEE_ID,
            }),
        },
    );

    if (response.status === 204) {
        console.log(`✅ Assign ticket thành công: ${issueKey}`);
        return;
    }

    const text = await response.text();
    console.warn(
        `⚠️ Assign ticket thất bại: ${issueKey} - ${response.status} ${text}`,
    );
}

// Chạy tạo ticket cho tất cả test fail
for (const test of failedTests) {
    await createTicket(test);
}
