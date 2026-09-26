# Design & User Experience (design)

## Overview
This folder houses all user interface prototypes, design assets, information architecture diagrams, and user journey maps for the Tech Smart Learning for Seniors website.

## User Personas 
**1. Cindy - Senior Learner 1**
- Age: 78
- Job: Retired, senior learner
- Location: Marietta, GA
- Family status: widowed
- Bio/story: Cindy enjoys learning new things during her retirement. A typical day of hers looks like going for walks to exercise in the morning, reading books and magazines, and talking to her friends and family on the phone. 
- Goals: She is looking for courses and articles that will teach her how to:
  - Support herself as a recent widow (sending emails, paying for bills online)
  - Use a smartphone to communicate with her family via text.
  - Learn how to use social media to stay connected with her friends.
- Pain points: 
  - She is having trouble finding formal training that aligns with her specific needs, and she is embarrassed to ask friends and family to teach her.
  - She is frustrated with navigating websites that don't present clear information.
  - Many websites lack guidance on how to find or buy resources when the next step is unclear.
  - She is unfamiliar with some common web navigation conventions (e.g., hamburger menus) and is more comfortable with familiar, explicitly labeled actions. When registering for something, she benefits from a clear sequence of steps and obvious indications of what to do next.
- Motivations: growth, social connection with family and friends
<hr>

**2. Thomas - Senior Learner 2 (with Accessibility needs)**
- Age: 84
- Job: Retired, senior learner with accessibility needs
- Location: Atlanta, GA
- Bio/story: Thomas is a grandfather who is quite active for his age. He spends most of his time going to church, volunteering, and taking walks. While he knows how to use modern technology (both email and smartphones), he faces roadblocks when it comes to vision problems and wanting to know more about online security.
- Goals: 
  - Learn how to identify phishing emails and common online scams. 
  - Find trustworthy articles and courses about protecting his personal information online. 
  - Independently find and read educational resources despite his visual limitations.
- Pain points:
  - Most websites are not accessible enough to him due to his poor vision, and this makes him frustrated.
  - Many websites have lack of contrast 
  - Many websites don't have large enough text 
  - He is wary of scam attempts online, as he already receives many scam calls and understands the risks.
- Motivations: Being able to comfortably read and navigate websites despite his visual limitations, while feeling safe and confident using the web and email without compromising his personal information
<hr>

**3. John - Volunteer**
- Demographics: 33, mechanical engineer
- Bio/story: 
  John works as an engineer for his local government. He works 9 am - 5 pm and has a wife and three kids. He is up-to-date on the latest technology trends, as he uses social media and plays video games during his free time. He has an aging mother whom he often helps with smartphone usage and has gained a heart for teaching seniors how to navigate smartphones.
- Goals:
  - Learn how he can help seniors use technology more effectively
  - Participate in teaching real classes that help seniors 
  - Help seniors learn how to connect with their local community through technology

- Pain points:
  - He finds it difficult to find volunteer opportunities that align with his busy schedule
  - He wants to find volunteer opportunities specifically for classes related to smartphones, but most opportunities cover general technology (i.e. he wants to filter by classroom topic)
  - He struggles to know the experience level required for each opportunity; he is not a formal teacher.
<hr>

**4. Alex - Corporate Partner**
- Demographics: 55, business leader
- Bio/story: Alex is a business leader of a finance company and has been given the task of making his company more philanthropic toward his community. He works 9 AM – 5 PM and is in charge of the budget and strategic direction of the company. Outside of work, he has increasingly spent time with his aging parents, so he understands their frustrations of learning new, emerging technologies.
- Goals:
  - Find ways his company can financially support Tech Smart for Seniors on a regular basis
  - Find ways his company can provide volunteers for training 
  - Discuss what technologies and resources his company has that might be useful for training opportunities 
- Pain points:
  - He needs transparency and the ability to offer his trust to a non-profit; he doesn’t know the equivalent value of what a certain amount of donations could produce (i.e. one iPhone? Three training sessions?)
  - He wants to quickly find out what his company can offer without searching through too much information.
  - Wants to answer the questions: What can we contribute? What will our contribution accomplish? How can our employees volunteer? What other resources can we provide? Who do we contact? [ChatGPT]
<hr>

**5. Patricia - Donor**
- Demographics: 40, school teacher
- Bio/story: Patricia is married with 3 kids. She works hard at home lesson planning for her job and also enjoys taking care of her family. She is enthusiastic about helping kids learn and loves the classroom. While she doesn’t have expertise teaching older adults technology skills, she is interested in donating toward such a cause.
- Goals:
  - Wants to contribute financially toward helping elderly learn skills
  - Understand how her donation will make a tangible difference for older adults [ChatGPT]
- Pain Points:
  - She doesn’t know where her money would be going towards when donating (i.e. is it distributed to where it’s needed most, or does she have a choice?)
  - She would like to set up recurring donations so that she doesn’t have to browse the website regularly.

## Website Prototype (v1)
Link (requires Figma login): https://www.figma.com/make/CxpBxF4lL8zXGGeXf00rLN/Update-website-wireframes?code-node-id=0-6&p=f&t=fjlmzgymiaEFXxxY-0&fullscreen=1

Preview:
<img width="1795" height="851" alt="image" src="https://github.com/user-attachments/assets/8cbf7252-c8af-444d-b95f-d44973817fcc" />

## User Journeys 
### Cindy: Finding Answers to Technology Questions Quickly (v1)
	1. User is wondering how to charge a new smartphone -> she arrives at landing page.
	2. Sees "I want technology help" at the top 
	3. Arrives at 4 choices -> chooses "free online resources"
	4. Selects one of 4 sub-categories (smartphone) -> feels frustrated from clicking so much, but relieved at simplicity and step-by-step clarity.
	5. Finds article on charging a smartphone
	6. Feels frustrated that she has to read through the article, but she finds her answer -> Task complete.

#### Improvements:
	1. Add FAQ on the free learning resources page per-category. (Note: this also improves SEO)

<hr>

### Cindy: Finding Answers to Technology Questions Quickly (v2)
	1. User is wondering how to charge a new smartphone -> she arrives at landing page.
	2. Sees "I want technology help" at the top 
	3. Arrives at 4 choices -> chooses "free online resources"
	4. Selects one of 4 sub-categories (smartphone) 
	5. Pleased to find her answer in the FAQ section, with articles for more details. -> Task complete.

#### Considerations:	
	1. For the ALL option (when selecting a technology category), we could only show FAQ when the user selects a technology category, or have a "Default" set of FAQ when the user selects ALL. The former might prevent the user from feeling overwhelmed from too much content, but the latter would provide consistency and possibly quicker answers.

<hr>

### John: Finding Volunteer Opportunities & Signing Up
	1. User is wondering how to volunteer.
	2. Sees "I want to volunteer" on landing page -> brought to volunteer options page.
	3. Volunteer options page has a "Classroom Volunteers" option -> clicks "See opportunities"
	4. Brought to Sign Up page -> selects filters for preferred day of week and location -> options filtered. Feels delighted that options are clearly presented and that filters work instantly (without another click).
	5. Clicks Sign Up -> modal appears. Feels frustrated that there is more work to be done. 	6. Fills out form -> clicks submit. Feels relieved that the process only took 2-3 minutes. 
	6. Task Complete.

#### Pain points:
	1. Clicking "I want to volunteer" doesn't provide list of opportunities up-front. There are several hoops to jump through- but only 2 clicks to get the opportunities page. Given that this is a reasonable user flow, the clarity of knowing where to go may outweigh the need for more efficiency.

#### Improvements:
	1. If we add login feature, system will already have all their information. Will be able to skip the contact form step every time. This may be good for recurring volunteers as well. (Note: a login/sign-up page would take 1 extra week of work, with design, API contract, and implementation included ... better as a stretch goal).
	2. Additional suggestion by ChatGPT: add a confirmation message to show that the user's form has been submitted.

<hr>

### John: Being Aware of Upcoming Events
	1. User is interested in seeing what upcoming events TechSmart is offering near him.
	2. Sees "upcoming events" animated circle at bottom right on landing page
		- 2b (alternative): Sees "Support Us" dropdown in navbar -> selects "Fundraising Events"
	3. Clicks -> redirected to "Events" page. Delighted to have found events with their details so quickly.

#### Pain Points:
	1. There was no option to filter events by date, but there may not be enough events at once to justify filtering. 
	2. If a senior selected it, thinking that events were for learning, they may not know how to get back to HOME other than the navbar.

#### Improvements:
	1. Have a clear "Back to Home" button on the Events page.

<hr>

### Patricia: Making a Donation
	1. User sees landing page -> feels excited about helping.
	2. User wants to help. They may:
		- Click "Support Us" > Partners > Individual donors (3 clicks)
		- Click "Donate" at top right without reading the rest of landing page (1 click)
		- Feel interested in TechSmart's story -> Read the full landing page -> arrive at the donate section at the bottom -> click Donate (one click)
	3. Arrive at donation center. 
	4. Enter amount and card details

#### Improvements:
	1. Apple Pay integration may help, but it statistically only improves overall donation rate by 2%.
	2. Added monthly giving to wireframe (new feature). According to statistics, 45% of donors give monthly; this could help overall donation rates.
## Wireframes (for layout purposes only, no styling)
### Landing Page:
<img width="975" height="714" alt="image" src="https://github.com/user-attachments/assets/13f29b9c-8d71-41c7-8b5f-de6a66a1d8bf" />

### Learn Technology Page:
<img width="975" height="944" alt="image" src="https://github.com/user-attachments/assets/9fb15aba-93f3-4920-a13f-6cea65385550" />

### Learn In-Person Page:
<img width="975" height="797" alt="image" src="https://github.com/user-attachments/assets/7aaec2c6-24ef-430d-83dd-c8e5aa4063ab" />

### Free Learning Resources Page (Wireframe Design):
#### Notes for Dev:
<img width="1006" height="667" alt="image" src="https://github.com/user-attachments/assets/b08eaac6-b6eb-4500-9b81-7fd8ab8f3149" />

### Donations Pages:
#### Notes for Dev: 
  - It's very important that we do input validation for each input field to ensure security and correctness.
  - API Contract: email on this page should align with email on "Contact Us" forms to find users.

#### Page 1:
<img width="687" height="437" alt="image" src="https://github.com/user-attachments/assets/739d82e2-154a-4a6a-81c0-21caca333b84" />

#### Page 2:
<img width="677" height="377" alt="image" src="https://github.com/user-attachments/assets/fdc148f7-d007-4048-ae35-afbe3689eaaf" />

#### Page 3:
<img width="817" height="432" alt="image" src="https://github.com/user-attachments/assets/028d2e7e-623c-4a83-9326-e62ab0b7265f" />

## To-Do
- Finish remaining wireframes:
    - Learn Online
    - Training Manuals
    - Support Us > Fundraising Events
    - Main Contact Page (do we need to make "Contact Us"/contact information more clear, i.e. put it on the navbar and/or landing page instead of the footer?)
    - About Us Page


