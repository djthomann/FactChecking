# FactChecking Application
An application that allows users to fact-check various statements, search for them and contribute information to them. 
Developed as a project in the seminar of "Media programming" in the winter term of 2026.

## Stakeholders
1. User: A person that wants to verify a fact they are interested in
2. Community: People that want to keep track of the verified facts and come to a consensus
3. Contributor: Someone that wants to share information on a topic in order to verify facts
4. Developer?
5. Client?

## Functional Requirements
1. Facts need to be displayed in a list of some sort
2. A fact needs a way to be verified or falsified
3. Search functionality for finding facts with keywords
4. Method of contributing a new fact
5. The consensus on a fact needs to be able to change
6. The system needs to be able to find duplicates
7. There needs to be a web-based interface

## UC1: A user searches for a fact

- **FR-1.1** The system shall allow users to search statements by keyword or phrase.
- **FR-1.3** The system shall display each statement's verdict, supporting and opposing evidence, and sources.
- **FR-1.4** The system shall suggest similar statements when a search returns few or no results.
- **FR-1.5** Anonymous users shall be able to search and read statements.

## UC2: A user contributes a new statement

- **FR-2.1** Registered users shall be able to submit a new statement with text.
- **FR-2.2** The system shall check for duplicates before accepting a submission and point the user to the existing statement.
- **FR-2.3** New statements shall start with the status "Unverified".

## UC3: A user shares information on a statement

- **FR-3.1** Registered users shall be able to attach evidence to a statement, marked as supporting or refuting.
- **FR-3.2** Evidence shall include a description and at least one source (URL or citation).
- **FR-3.3** The system shall record the author and timestamp of every contribution.
- **FR-3.4** Users shall be able to comment on evidence.

## UC4: The community agrees on the truth/falsehood of a statement

- **FR-4.1** Registered users shall be able to vote on a statement (true, false, or insufficient evidence), with one vote per user per statement.
- **FR-4.2** The system shall compute a consensus verdict from the votes using a documented algorithm.
- **FR-4.3** A verdict shall be marked "Established" only after a minimum number of votes and agreement threshold are met.
- **FR-4.4** The system shall reopen a verdict when significant new evidence is added.
- **FR-4.5** The system shall keep a visible history of verdict changes.

## Non-Functional Requirements
1. The search for a fact needs to be completed within 2 seconds
2. Consensus shall be recalculated within 5 seconds of a new vote
3. The system shall use a modular design so that search, voting, and evidence components can be updated independently.
4. Votes, evidence, and verdict changes shall be recorded in an auditable log.

## Minimum Viable Product
1. User can enter a claim
2. User can submit a claim
3. Claim is stored in the system