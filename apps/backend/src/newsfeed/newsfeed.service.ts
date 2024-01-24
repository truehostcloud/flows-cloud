import { Injectable } from "@nestjs/common";

@Injectable()
export class NewsfeedService {
  async postMessage({ message }: { message: string }): Promise<Response> {
    return fetch(process.env.BACKEND_SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        text: message,
      }),
    });
  }
}
