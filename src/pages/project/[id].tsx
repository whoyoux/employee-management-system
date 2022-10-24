import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import toast from "react-hot-toast";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import { trpc } from "../../utils/trpc";

type ProjectProps = {
  id: string;
  userId: string;
};

const Project: NextPage<ProjectProps> = ({ id, userId }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const { isLoading, data: project } = trpc.project.get.useQuery({
    id,
  });

  const { data: employees, refetch } = trpc.project.getAllEmployees.useQuery({
    id,
  });

  const createEmployee = trpc.employee.create.useMutation({
    onSuccess: () => {
      setFirstName("");
      setLastName("");
      toast.success("New employee created!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
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

  return (
    <>
      <Head>
        <title>Project</title>
      </Head>
      <div className="mt-10 flex w-full flex-row justify-center gap-10 text-4xl">
        <div className="flex flex-col gap-4 text-xl">
          <h2>{project.name}</h2>
          <input
            type="text"
            placeholder="First name..."
            className="btn"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
          <input
            type="text"
            placeholder="Last name..."
            className="btn"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
          <button
            className="btn text-2xl"
            onClick={() =>
              createEmployee.mutate({
                firstName,
                lastName,
                projectId: id,
                addedById: userId,
              })
            }
          >
            Add new employee
          </button>
        </div>
        <div className="flex flex-col items-center">
          <h4>Employees</h4>
          <div className="mt-5 text-xl">
            {employees?.employees.length === 0 ? (
              <h5>No employees found</h5>
            ) : (
              employees?.employees.map((employee) => (
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
  firstName: string;
  lastName: string;
};

const EmployeeCard: React.FC<EmployeeCardProps> = ({ firstName, lastName }) => {
  return (
    <div>
      <h5>
        {firstName} {lastName}
      </h5>
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
    props: { id, userId: session.user?.id },
  };
}

export default Project;
