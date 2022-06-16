import { component$, useStore, useWatch$ } from '@builder.io/qwik';

export const App = component$(() => {
  const github = useStore({
    organization: 'builderio',
    repos: ['qwik', 'partytown'] as string[] | null,
  });
  useWatch$(() => {});
  return (
    <div>
      <span>
        GitHub username:
        <input
          value={github.organization}
          onKeyUp$={(event) => (github.organization = (event.target as HTMLInputElement).value)}
        />
      </span>
      <div>
        {github.repos ? (
          <ul>
            {github.repos.map((repo) => (
              <li>
                <a href={`https://github.com/${github.organization}/${repo}`}>{repo}</a>
              </li>
            ))}
          </ul>
        ) : (
          'loading...'
        )}
      </div>
    </div>
  );
});

export async function getRepositories(username: string, controller?: AbortController) {
  const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
    signal: controller?.signal,
  });
  const json = await resp.json();
  return Array.isArray(json) ? json.map((repo: { name: string }) => repo.name) : null;
}
