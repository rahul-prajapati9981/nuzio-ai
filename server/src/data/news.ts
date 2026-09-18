export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  source: string;
  publishedAt: string;
  duration: string;
  image: string;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 1,
    title: "Artificial intelligence transforms modern workplaces",
    summary:
      "Companies are using AI tools to improve productivity and automate repetitive tasks.",
    content:
      "Artificial intelligence is changing how modern teams work. Companies are adopting AI assistants to summarize information, automate repetitive tasks and help employees make faster decisions. Experts believe that organizations should combine automation with human judgment and responsible data practices.",
    category: "Technology",
    source: "Nuzio Tech",
    publishedAt: "Today",
    duration: "2 min",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Global markets respond to new economic outlook",
    summary:
      "Investors are reviewing inflation, interest rates and upcoming economic indicators.",
    content:
      "Global markets showed mixed movement as investors evaluated the latest economic outlook. Analysts are watching inflation data, employment numbers and central bank decisions. Market experts recommend focusing on long-term financial goals instead of reacting to short-term volatility.",
    category: "Finance",
    source: "Market Daily",
    publishedAt: "1 hour ago",
    duration: "3 min",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Startups build practical products with generative AI",
    summary:
      "New businesses are integrating generative AI into healthcare, education and commerce.",
    content:
      "Technology startups are developing practical generative AI products for healthcare, education and online commerce. Investors are especially interested in businesses that solve clear customer problems and maintain strong data security. Founders say user trust remains essential for sustainable growth.",
    category: "Startups",
    source: "Startup Pulse",
    publishedAt: "2 hours ago",
    duration: "2 min",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Simple daily habits can support better health",
    summary:
      "Health specialists recommend regular movement, good sleep and balanced nutrition.",
    content:
      "Health specialists say small and consistent habits can support long-term wellbeing. Regular physical activity, sufficient sleep, balanced nutrition and routine medical checkups are important. People should consult qualified professionals before making significant changes to their healthcare routine.",
    category: "Health",
    source: "Health Brief",
    publishedAt: "3 hours ago",
    duration: "2 min",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    title: "Space researchers prepare for future lunar missions",
    summary:
      "Scientists are testing technologies designed for longer missions around the Moon.",
    content:
      "Space researchers are testing navigation, communication and life support technologies for future lunar missions. These experiments will help scientists understand how people and equipment can operate safely in deep space. International cooperation continues to play an important role in exploration.",
    category: "Science",
    source: "Science World",
    publishedAt: "4 hours ago",
    duration: "3 min",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    title: "Teams prepare for an exciting season of competition",
    summary:
      "Coaches are balancing experienced players with emerging young talent.",
    content:
      "Sports teams are preparing for another competitive season. Coaches are combining experienced players with promising young talent while focusing on fitness, strategy and teamwork. Supporters are looking forward to close matches and memorable performances.",
    category: "Sports",
    source: "Sports Desk",
    publishedAt: "5 hours ago",
    duration: "2 min",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=900&q=80",
  },
];
