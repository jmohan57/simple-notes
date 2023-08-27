export type AppCard = {
  title: string;
  description: string;
  path: string;
};

export const appCards: AppCard[] = [
  {
    title: "My Notes",
    description:
      "This is a simple and easy-to-use micro app that allows you to store your notes in the cloud and can be accessed from anywhere, at any time. Whether you're on the go or at home, the micro app makes it easy to take notes and stay organized.",
    path: "/mynotes",
  },
  {
    title: "My Boards",
    description:
      "A simple and easy-to-use micro app that allows you to create and manage your tasks by creating a board, it is fully customizable. Your boards are stored in the cloud and can be accessed from anywhere, at any time. Give it a try to checkout all the amazing features.",
    path: "/myboards",
  },
  {
    title: "Knowledge Test",
    description:
      "A simple and easy-to-use micro app that allows you to test your knowledge on any topic with questions of various difficulty level, and at the produce to you a analysis report of the test. All the reports can be accessed later from any devices as they are stored in the cloud.",
    path: "/ktest",
  },
];
