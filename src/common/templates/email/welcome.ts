// src/common/templates/email/welcome.ts

import { emailLayout } from "../layout.template";

export const welcomeTemplate = (name: string) =>
  emailLayout(`
<h2>Welcome ${name} 👋</h2>

<p>Your account has been created successfully.</p>

<p>We're happy to have you onboard.</p>
`);
