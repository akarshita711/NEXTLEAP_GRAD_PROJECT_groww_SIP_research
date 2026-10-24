/**
 * Creates the SIP screener Google Form (12 MCQs + optional contact).
 * HOW TO USE: go to https://script.google.com -> New project -> paste this -> Run createScreener.
 * Approve permissions. The Logger / Executions log prints the form's edit and share links.
 */
function createScreener() {
  var form = FormApp.create('First-time SIP investors: a 3-minute survey');
  form.setDescription(
    "I'm a product management student researching how first-time investors in India experience their first SIP (Systematic Investment Plan) in mutual funds. This takes ~3 minutes.\n\n" +
    "- I will NOT ask for your PAN, bank/account numbers, folio numbers or any portfolio screenshots.\n" +
    "- Answers are used only for this learning project and are never shared with any company.\n" +
    "- This is research, not investment advice or a sales pitch.\n" +
    "- Some respondents may be invited for a 30-minute chat. You can say no, and you only share contact details on the last question if you're open to that.");
  form.setConfirmationMessage('Thank you! If you are shortlisted for a chat, I will reach out only on the contact you shared.');
  form.setCollectEmail(false);
  form.setProgressBar(true);

  // Q1 with branching: "No"/"Not sure" ends the form
  var q1 = form.addMultipleChoiceItem().setTitle('1. Was your SIP your very first mutual fund investment?').setRequired(true);
  q1.setChoices([
    q1.createChoice('Yes, it was my first mutual fund investment', FormApp.PageNavigationType.CONTINUE),
    q1.createChoice('No, I had invested in mutual funds before', FormApp.PageNavigationType.SUBMIT),
    q1.createChoice('Not sure', FormApp.PageNavigationType.SUBMIT)
  ]);
  form.addPageBreakItem().setTitle('About your SIP');

  function mc(title, choices) {
    form.addMultipleChoiceItem().setTitle(title).setChoiceValues(choices).setRequired(true);
  }

  mc('2. When did you start that first SIP?', ['Less than 3 months ago','3–6 months ago','7–12 months ago','13–18 months ago','More than 18 months ago']);
  mc('3. Which platform did you use to start it?', ['Groww','Zerodha Coin','INDmoney','Another investing app (e.g., Paytm Money, Kuvera, ET Money, Upstox)','A bank / distributor / advisor','Not sure']);
  mc('4. What is the current status of that first SIP?', ['Running, same amount as I started','Running, but I reduced the amount','Running, but I increased the amount','Paused (planning to resume)','Stopped / cancelled','Stopped, then started a different SIP','Not sure (instalments may be failing)']);
  mc('5. Your age band', ['Under 22','22–25','26–30','31–35','36–45','Over 45']);
  mc('6. Which best describes your income?', ['Salaried, fixed monthly pay','Salaried, part of pay is variable (incentives/commission)','Freelance / self-employed / business, irregular income','Student or fully supported by family','Not earning at the moment']);
  mc('7. Where does your SIP money mostly come from?', ['Leftover from my monthly salary / income','Side income or freelance earnings','Bonus / lump-sum savings','Pocket money / allowance from family','Money set aside from a specific goal fund','Other']);
  mc('8. Roughly how much is (or was) your monthly SIP?', ['Under ₹500','₹500–₹1,000','₹1,001–₹2,500','₹2,501–₹5,000','₹5,001–₹10,000','Above ₹10,000']);
  mc('9. Who or what influenced you to start?', ['A friend or colleague','Family member','A YouTube / Instagram finance creator','My workplace or a financial-literacy session','An ad or in-app prompt on the investing app','My own research','Other']);
  mc('10. How often do you open your investing app to look at your SIP/investments?', ['Almost daily','Once or twice a week','A few times a month','About once a month','Only when I get a notification or reminder','Rarely / almost never']);
  mc('11. When you feel unsure about your SIP (e.g., low returns, a confusing number), what do you usually do first?', ['Google it or watch YouTube videos','Ask a friend or family member','Check Reddit / Telegram / WhatsApp groups','Ask a financial advisor / relative who invests',"Contact the app's support or look in the app's help section",'Nothing, I just wait and see']);
  mc('12. Have you ever thought about pausing, reducing or stopping your SIP? What was the main reason?', ['No, never thought about it','Money got tight for a month or two','Returns looked low or negative',"I didn't understand what was happening with my investment",'I needed the money for something else','An instalment failed (bank / balance / mandate issue)','I wanted to move to a different option','Other']);

  form.addSectionHeaderItem().setTitle('Optional').setHelpText('Open to a 30-minute chat about your SIP experience? Share your first name and WhatsApp number or email. Do NOT share PAN, account numbers or any portfolio screenshots.');
  form.addTextItem().setTitle('First name + WhatsApp number or email (optional)').setRequired(false);

  Logger.log('Edit link (yours): ' + form.getEditUrl());
  Logger.log('Share link (circulate this): ' + form.getPublishedUrl());
}
