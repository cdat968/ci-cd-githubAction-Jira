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
    const response = await fetch(`${JIRA_URL}/rest/api/2/issue`, {
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
                description:
                    `*Commit:* ${COMMIT_SHA}\n` +
                    `*Author:* ${AUTHOR}\n\n` +
                    `*Test failed:*\n${test.fullName}\n\n` +
                    `*Error:*\n{code}${test.failureMessages.join("\n")}{code}`,
                priority: { name: "High" },
                labels: ["auto-created", "ci-failure"],
            },
        }),
    });

    const data = await response.json();

    if (response.ok) {
        console.log(`✅ Ticket tạo thành công: ${data.key}`);
    } else {
        console.error(`❌ Lỗi tạo ticket: ${JSON.stringify(data)}`);
    }
}

// Chạy tạo ticket cho tất cả test fail
for (const test of failedTests) {
    await createTicket(test);
}
