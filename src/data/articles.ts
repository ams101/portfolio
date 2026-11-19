export interface Article {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  whyIWroteThis: string;
  content: string;
}

export const articles: Article[] = [
  {
    id: 'chatbots',
    title: 'Chatbots: What they are and how to get them right',
    subtitle: 'Designing chatbots as assistants, not annoying robots',
    description: 'A practical take on chatbots: what they are, why businesses use them and how to make them genuinely helpful. Tone of voice, UX simplicity, predictive search, testing, feedback loops, resolution tracking, and why chatbots should augment human support, not replace it.',
    whyIWroteThis: 'Chatbots are often treated as a cheap support replacement instead of a product and UX problem. This piece breaks down what a chatbot actually is, why companies adopt them and a set of simple, product-focused principles to make them work: define the job-to-be-done, keep the tone human, make navigation easy, use predictive search, test obsessively and always provide a clean path to a human.',
    content: `Chatbot. What is it? Well, according to Wikipedia "A chatbot is a software application used to conduct an on-line chat conversation via text or text-to-speech, in lieu of providing direct contact with a live human agent".

To be in more simpler terms, Chatbot is an automated answering and conversation software application that can converse with pre defined responses or more modern ones with ever updating vocabulary thanks to natural learning and Artificial Intelligence. Let's not get into that and open that can of worms or shall I say bots. A chatbot is similar to an answering device that we often hear on answering machines etcetera, just that chatbot is on text.

## Damn them numbers

You might ask, why does one need a chatbot when you can just do away with FAQs or well not that too. Let's look at some numbers and figures (boring I know!)

64% of respondents felt that chatbots will enable them provide more personalized service experience for customers. That's a good thing considering it would help the company serve its customers in a better way.

The chatbot adoption in the market is expected to increase from $2.6 billion in 2019 to $9.4 billion by 2024 at an average annual rate (CAGR) of 29.7%. Overall, CAGR for Artifical Intelligence (AI) based technologies is expected to be 40%.

Enough about markets, let's see what users feel about chatbots.

87% of respondents worldwide felt chatbots were effective or highly effective in resolving their issues.

So now we know, chatbots are here for the good and they are well moving ahead akin how Arnold Schwarzenegger moved towards Skynet in terminator.

## Getting them bots to chat right

So here's a personal opinion on how to get chatbots right. This might work for some, for some it might not. But well, here's how it goes.

The best practices based on observations and interacting with chatbots in my opinion are:

**Define the need of chat bot:** what purpose the chatbot would serve and who is it aimed for, who are it's end users - the buyers or sellers.

**Tone of Chatbot should be human and not robotic.** For example, chatbot addressing user as guest XYZ is not very humane, feels more terminator-esque rather than Sofia-esque.

**Universal accessibility of help section** where the chatbot can be accessed from. It helps the user in navigation and is perceived by the user as "easy to use".

**Predictive search.** The power of predictive search is underrated, it can be an enormous help to the users who frequent the chatbot for resolution of their queries or in their interaction.

**Frequent and most common used label** above the chat / type screen to enhance user experience.

**User interface should be uncluttered and simplistic.**

**Testing.** Test, test and test more so your bot is free of errors, giving users that always correct and helpful feel from your bot.

**Feedback should be Realtime** and should address only if the query was addressed so as to know if the responses are accurate.

**Check resolution rate.** You need to be on top of your bot game to know if your bot is really answering the users in the correct way or is it not?

**Instead of building chatbot in a waterfall method, use agile method** where features are added as and when required based on user feedback and usage. To keep it minimalistic and uncluttered as possible.

**For B2B focussed more towards businesses,** The chatbot rather than query re-addressal mechanism should be used as digital assistant. This would aid and facilitate users which can improve and better the user experience.

**Don't just do away with your Customer support team.** The chatbots and psyche have not advanced to an extent where you can do away with your support team. The chatbot should have functionality to re-direct the user to a live agent or support member to serve their query if the bot fails or if the user percieves that the bot has failed.

Just a disclaimer - I am not a Chatbot expert, though I'd like for you to think I am.`,
  },
  {
    id: 'gamestop',
    title: 'GameStop: The big short squeeze',
    subtitle: "Why Reddit could pull it off in the US - and why it's harder in India",
    description: "How GameStop went from $10 to $483 on short squeezes, options and Reddit coordination, how shorting works, why hedge funds got trapped, and why India's SEBI rules, circuit filters and weak stock-lending culture make a replay much harder.",
    whyIWroteThis: "The GameStop saga is more than a meme stock story - it's a case study in incentives, market structure and community coordination. This article explains how hedge funds shorted GameStop, how Reddit traders engineered a short squeeze and why the same playbook doesn't port directly to India because of SEBI regulation, intraday limits and a weak stock-lending culture.",
    content: `GameStop stock in the US rose from $10 to $483 in a span of just 20 trading days. In this David vs Goliath event, Sophisticated hedge funds were beaten at their own game by amateur stock traders.

GameStop is a publicly-traded company, best known for selling video-game discs and cartridges in shopping malls. This model was never enticing to the younglings and old larks who could just download the latest titles sitting from their couch or their gaming dens.

Until recently this lax model was evident from Gamestop share prices which were $18.84 by New Year's Eve 2020. However, as finance teaches (or doesn't) that the value of the company cannot be derived only from it's expected future earnings. There is one another factor "Does R/wallstreetbets find GameStop stocks funny?". That's what the majority of the hedge funds failed to ask.

## How to get rich on failing hardcore game store?

Say you're a hedge fund that has determined, through expert analysis, that the future of video-game retail is even bleaker than its present. One way to make money off that insight would be to borrow shares of GameStop, sell them for cash, wait for the price of these shares to inevitably fall, then buy them back at a lower rate but it can be a risky manoeuvre. To borrow shares, you need to put up collateral and be prepared to return such shares whenever your lender asks to have them back. If the shares you borrowed start climbing in value, then you'll have to find more collateral to satiate your lender while waiting for the market to finally recognize the truth of your analysis. If you run out of collateral, or your lender runs out of patience, you'll need to buy back those shares at a loss. Repurchased shares to your lender. This is called "shorting a stock."

## Reddit says "no that's not how you do it".

Reddit a popular social media website that has multiple user-created areas of interest of popularly called "subreddits" or "subs". The users of Reddit so often called "Redditors" held a different view about getting rich from GameStop, simply cause well, they're bored.

One way to amuse yourself - and potentially make money - would be to (1) gather with thousands of other similarly inclined people in an internet forum, (2) identify stocks that are being heavily shorted, and then (3) collectively buy up a bunch of shares in those stocks, so as to orchestrate a short squeeze.

Better yet: To get more bang for your investment buck, you could buy call options for your desired stock. A call option is a contract that entitles its owner to buy a given stock at a specified price within a specified time period. And it's a great financial product for investors whose appetite for risk outstrips their cash on hand.

Melvin Capital, a hedge fund that was heavily short on GameStop faced the wrath of a few amateurs (debatable) bored Redditors.

To hedge against the risk that GameStop shares will rise to the bizarrely high "strike" prices people keep asking for, you need to buy up a certain number of GameStop shares yourself.

If, in the ensuing days, a short squeeze is triggered - and the value of GameStop shares rises beyond all-expectation - you will need to buy more of your own shares to keep your books neutral. In doing so, you will put upward pressure on the price of the stock, which could force more shorts to buy, thereby increasing the price of the stock, leading you to buy more shares to keep your books neutral, in a cycle that's vicious for hedge-fund shorts - and glorious for Reddit longs.

## Aftermath

First and foremost, the GameStop saga has brought to light to the corrupt nature of the world's financial systems. The practice of shorting business stocks, which hedge funds believe are overvalued, is fundamentally corrupt. It rewards investors and punishes savers since market manipulation inflates asset prices and devalues savings.

Melvin's assets under management now stand at more than $8 billion - including the emergency funding - down from roughly $12.5 billion.

The biggest beneficiary of the GameStop surge is Ryan Cohen, co-founder of Chewy, whose 13 per cent stake in GameStop is now worth over $1 billion.

United States Senator Elizabeth Warren, a Democrat, criticised the SEC (Security and Exchange Commission) which is responsible for enforcing the law against market manipulation in the USA for their failure to take action on what she called market manipulation.

## Why you can't pull off a GameStop in India?

SEBI (security and exchange board of India) keeps a close eye on extreme price movements and concentrated positions in stocks. It routinely sends out notices if it observes discrepancies.

Secondly, we have intraday filters. A stock cannot move beyond 20 per cent in a day. Once a stock keeps hitting upper circuits, the regulator reduces the intra-day limit to 10 per cent, 5 per cent and 2 per cent. Although the intraday filers are not allowed in stocks in which futures and options take place, the SEBI can exclude those from the F&O (Futures and options) segment.

The stock lending market, the core in the GameStop fiasco, is not much active in India. Stock lending and Borrowing Mechanism (SLBM) was launched in India in 2008, but it hasn't picked pace. The lender's income is qualified as "income from other sources", so people lending will have to file using ITR3 and may need audits. These act as a deterrent and as a result Stock lending and borrowing culture is weak or non-existent in India which is the core behind shorting as well as what happened at GameStop in the USA.`,
  },
];
