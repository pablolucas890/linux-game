import { OutputCommandTest, OutputCommandTestArray } from '@/src/types/props';
import type { NextApiRequest, NextApiResponse } from 'next';

type PostResponseData = {
  message: string;
  success: boolean;
};

type Slug = 'command' | 'result';

const OUTPUT_COMMAND_TEST_ARRAY: OutputCommandTestArray = {
  command: ['cat index.html | grep pubic -n', 'cat index.html | grep -n pubic'],
  directory: ['/var/www/html'],
  output: ['<color=green>206</color>:         <p>The new policy was discussed in a pubic meeting.</p>'],
};

const CORRECT_RESULT = '206';

export default async function handler(req: NextApiRequest, res: NextApiResponse<PostResponseData>) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed', success: false });
    }

    const { slug } = req.query as { slug: Slug };

    if (!slug) {
      return res.status(400).json({ message: 'Slug is required', success: false });
    }

    if (slug === 'command') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { command, directory, output } = data as OutputCommandTest;

      const ok =
        OUTPUT_COMMAND_TEST_ARRAY.command.includes(command) &&
        OUTPUT_COMMAND_TEST_ARRAY.directory.includes(directory) &&
        OUTPUT_COMMAND_TEST_ARRAY.output.includes(output);

      if (ok) {
        res.status(200).json({ message: 'Command executed successfully', success: true });
      } else {
        res.status(400).json({ message: 'Command executed failed', success: false });
      }
    } else if (slug === 'result') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { result } = data as { result: string };

      if (!result) {
        return res.status(400).json({ message: 'Result is required', success: false });
      }

      if (result === CORRECT_RESULT) {
        res.status(200).json({ message: 'Result is correct', success: true });
      } else {
        res.status(400).json({ message: 'Result is incorrect', success: false });
      }
    } else {
      return res.status(400).json({ message: 'Invalid slug', success: false });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Error processing request', success: false });
  }
}
