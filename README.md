<p style="margin-top:1rem;" align="center">
    <img src="./logos%20&%20branding/logo.png" style="width:10rem">
</p>
<h1 align="center">FOAMS, a food ordering and automated management system, open source, and free to use.</h1>
<h2>Why?</h2>
<p>I created it because the feast of the parish community of my city, needed a better way to organize its food orders. </p><p>The previous method was to use an Access mask that worked with the Access database, to manage orders locally. It wasn't bad, but it wasn't really complete, and it missed a lot of features, like:</p>
<ul>
    <li>A way to manage the fact that a food can be sold out, if its ingredients are finished;</li>
    <li>A way to make possible for people in the queue, to order online (only if wanted), to speed up the queue;</li>
    <li>A better user interface and user experience, to let it be used even by elder people, working in the feast;</li>
</ul>
<hr />
<h2>How?</h2>
<p>To manage the first point I had to refactor the way foods were made by adding ingredients, and basing the displaying of foods, based on the availability of ingredients. To manage that, with keeping in mind concurrency problems, I used ACID transactions, using the Prisma.js ORM.</p>
<p>To manage the second point, I had to place the backend of the software online. To do that I had to create a CRUD REST API (made in Typescript). I choose a REST API because I didn't need flexibility on the API endpoints, as I am the designer of the backend, and the frontend.</p>
<p>Finally, to manage the third point I had to be as clear as possible in the usage of the app, handling all kinds of errors, and creating a good UI/UX experience.
<br/>
The help me with validation and errors on the backend I used Zod (really useful even for type inference), and the default error-manager-middleware that Express.js has. 
<br/>
Instead, for UI/UX I used bootstrap (using React-Bootstrap) because of its clear and minimal UI.
</p>
<hr />
<h2>How to use it? (locally [exept for the database])</h2>
<p>I want to be clear that the platforms I will use, can be changed with whatever platform you want. I used them just because of their plan prices.</p>
<p align="center">____________________________</p>
<h3>Initial set-up:</h3>
<p>To use the application you need to have Node.js installed. Download it from <a href="https://nodejs.org/it/download/">here</a> if you don't have it.</p>
<p>To setup the database, you firstly need to go inside the `backend` folder, and only after that, run the CLI command `npm install`.</p>
<p align="center">____________________________</p>
<h3>Setting up the database:</h3>
<p>You can use any db you want, hosted everywere you want, as long as you follow the really simple process, of setting up a db using Prisma. <a href="https://www.prisma.io/docs/getting-started/quickstart">(See here)</a></p>
<p>As a databse I used <a href="https://planetscale.com/">Planetscale</a> because it's pretty performant, and its free db plan it's really good.<br/>
You have to create an account, and then create a database following <a href="https://planetscale.com/docs/tutorials/planetscale-quick-start-guide">the guide</a> (choose a region that it's as near as possible to your country).
</p>
<p>Now that you have a new database, click on the connect button (in the `overview` section), and choose `prisma` in the `connect with` section.<br/>
You will see the connection URL, that you have to copy (with the Username and Password of the database written inside it), and paste inside the `.env` (you have to create it first) file, inside the `backend` folder, written this way:
</p>
`DATABASE_URL='mysql://hanusndo9o9im9x3s5p6:************@eu-central.connect.psdb.cloud/san-lorenzo-db?sslaccept=strict'`
<p>When you did that and saved the file, run the following CLI comand `npx prisma db push`, to change the schema of the database on Planetscale.</p>
<p align="center">____________________________</p>
<h3>Setting up authentication & the backend:</h3>
<p>In the same `.env` file you wrote the URL to connect to the Planetscale database, (inside the `backend` folder), you have to set four more environment variables:</p>
<ul>
<li>ADMIN_USERNAME='UsernameYouWantToUse'</li>
<li>ADMIN_PASSWORD='PasswordYouWantToUse'</li>
<li>JWT_SECRET='JWTSecretYouWantToUse'</li>
<li>PORT='8080'</li>
</ul>
<p>USERNAME and PASSWORD are used as credientials, to log inside the administrative part of the application.<br/>
JWT_SECRET is a string (raccomanded between 30 and 50 characters).
<br/>
PORT has to remain 8080 (the port where the backend will be hosted to).
</p>
<p>Now that everithing is set and saved, if you run the command `tsc` and if no error arised, run this command `npm start`, the console should print: `Listening on port: 8080`, and it means that the server works correctly.</p>
<p align="center">____________________________</p>
<h3>Setting up the frontend:</h3>
<p>Go inside the `frontend-admin` folder, and create a `.env`. Inside of it you have to create an environment variable:</p>
<ul><li>VITE_BACKEND_URL=http://localhost:8080</li></ul>
<p>This environment variable is used to let the frontend know, where the backend is located. In this case, the backend is set locally (that's why localhost), and on PORT 8080.</p>
<p>After you did that and saved, inside the `frontend-admin` folder, you should run the command `npm run dev`.<br>
If everything goes ok, the console will show you a link, where you can locally see your frontend up and running. Copy it into a web browser, or Control+Click it to see the frontend.</p>
<h2>How to use it? (remotely)</h2>
<h3>Initial setup:</h3>
<p>To use the platforms I use to host the backend and the frontend, you have to create a <a href="https://github.com">Github</a> account, and fork my repository into your account, or if it doesn't work, create a repository, and clone my repository inside of it.</p>
<p align="center">____________________________</p>
<h3>Using cloud platforms:</h3>
<p>To host the backend I used <a href="https://railway.app/">Railway</a>, because it's easy to use and the developer plan is fantastic.</p>
<p>Simply connect with the github account you previously created, and select the fork/repository you created, that you want to host.<br>
CONFIGURATIONS: you have to set up the environment variables, as explained in the section `How to use it? (locally)`, using the environment variables section; you have to configure the directory (you have to choose the backend directory); and you have to configure the build command (simply configure it as `tsc`).</p>
<p>To host the frontend I used <a href="https://vercel.com/">Vercel</a>, because it's easy to use and it's pretty performant (the free plan it's really good).<br/>
CONFIGURATIONS: you have to set up the environment variable, as explained in the section `How to use it? (locally)`, using the environment variables section.</p>

