import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";

type ProjectProps = {
  id: string;
};

const Project: NextPage<ProjectProps> = ({ id }) => {
  const { isLoading, data: project } = trpc.project.get.useQuery({
    id,
  });

  if (isLoading) {
    <div className="mt-10 w-full text-center text-4xl">
      <h1>Loading</h1>
    </div>;
  }

  if (!project)
    return (
      <div className="mt-10 w-full text-center text-4xl">
        <h1>Project not found!</h1>
      </div>
    );

  console.log(project);
  return (
    <>
      <Head>
        <title>Project</title>
      </Head>
      <div className="mt-10 w-full text-center text-4xl">
        <h2>{project.name}</h2>
        <button className="btn mt-5 text-2xl">Add new employee</button>
        <div className="mt-10">
          <h4>Employees</h4>
          <div className="mt-5 text-xl">
            {project.employees.length === 0 ? (
              <h5>No employees found</h5>
            ) : (
              project.employees.map((employee) => (
                <EmployeeCard key={employee.id} {...employee} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

type EmployeeCardProps = {
  name: string;
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({ name }) => {
  return (
    <div>
      <h5>{name}</h5>
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return ctx.res.writeHead(302, {
      Location: "/",
    });
  }

  const id = ctx.params?.id || "";

  if (!id || id === "" || typeof id !== "string") {
    return {
      notFound: true,
    };
  }

  return {
    props: { id },
  };
}

export default Project;
