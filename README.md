# Remix of Library Hub

Build a simple full-stack web app called LibFind for a college project.

Purpose

Users can find nearby libraries and see which books and magazines are available there.

Keep it simple

This is only a prototype using dummy data. Do not add payments, reservations, reviews, maps, notifications, AI recommendations, external APIs, or other unnecessary features.

Required features

Authentication

Sign up

Login

Logout

Use Supabase Auth

Pages

Landing page

Login / Sign up

Home

Library details

Book details

Manage Books

Main user journey

Login → Home → View libraries → Select library → View/search books and magazines → Open a title → See availability and library.

Database

Use Supabase with these tables:

libraries

id

name

address

city

books

id

title

author

type (Book/Magazine)

available (true/false)

library_id

Create the necessary relationship between books and libraries.

CRUD

The Manage Books page must support:

Create a book

Read/view books

Edit a book

Delete a book

Fields:
title, author, type, availability, library.

All CRUD actions must actually persist in Supabase and still be visible after refreshing the page.

Dummy data

Add 5 dummy libraries and around 20 dummy books/magazines distributed across them.

UI

Make it clean, simple and modern.
Responsive on desktop and mobile.
Use cards and simple navigation.
Include basic loading, empty and error states.

Final requirement

Everything must work end-to-end with Supabase:

authentication

library browsing

search

title details

CRUD

Do not create fake frontend-only functionality.
Do not add features beyond what is listed above.

Before finishing, test the complete user journey and make sure there are no broken buttons or pages.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://find-my-booky.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1c7a21ce-0988-4885-bb14-2e2b529ccf3e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
